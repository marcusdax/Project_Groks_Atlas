"use client";

import { useEffect, useRef, useState } from "react";
import type { RoofModel, Vec3 } from "@/lib/atlas/roof-geometry";
import { EDGE_COLORS } from "@/lib/atlas/roof-style";
import type { RoofKind } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

const ROOF_COLORS: Record<RoofKind, string> = {
  composition: "#5d6168",
  architectural: "#4f5359",
  metal: "#7d8a93",
  tile: "#9a6a57",
};

const STORY_FT = 9;

/** Orbitable 3D model of the solved roof on extruded walls. three.js loads on demand. */
export function Roof3D({
  model,
  stories,
  roofKind,
  className,
}: {
  model: RoofModel;
  stories: number;
  roofKind: RoofKind;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let disposed = false;
    let teardown: (() => void) | undefined;

    Promise.all([import("three"), import("three/examples/jsm/controls/OrbitControls.js")])
      .then(([THREE, { OrbitControls }]) => {
        if (disposed) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
          setStatus("error");
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.display = "block";
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const wallH = Math.max(1, stories) * STORY_FT;
        // Model space is x east, y north, z up (feet). three.js is y-up.
        const v = ([x, y, z]: Vec3 | [number, number, number], lift = 0) =>
          new THREE.Vector3(x, z + wallH + lift, -y);

        const disposables: { dispose: () => void }[] = [];
        const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

        const polygonMesh = (pts: Vec3[], material: InstanceType<typeof THREE.Material>) => {
          // Triangulate in the polygon's own plane so vertical gables work too.
          const verts = pts.map((p) => v(p));
          const n = new THREE.Vector3();
          for (let i = 0; i < verts.length; i += 1) {
            const a = verts[i];
            const b = verts[(i + 1) % verts.length];
            n.x += (a.y - b.y) * (a.z + b.z);
            n.y += (a.z - b.z) * (a.x + b.x);
            n.z += (a.x - b.x) * (a.y + b.y);
          }
          n.normalize();
          const u = new THREE.Vector3(1, 0, 0);
          if (Math.abs(n.dot(u)) > 0.9) u.set(0, 1, 0);
          u.sub(n.clone().multiplyScalar(n.dot(u))).normalize();
          const w = new THREE.Vector3().crossVectors(n, u);
          const flat = verts.map((p) => new THREE.Vector2(p.dot(u), p.dot(w)));
          const tris = THREE.ShapeUtils.triangulateShape(flat, []);
          const g = track(new THREE.BufferGeometry());
          g.setFromPoints(verts);
          g.setIndex(tris.flat());
          g.computeVertexNormals();
          return new THREE.Mesh(g, material);
        };

        const roofMat = track(
          new THREE.MeshStandardMaterial({
            color: ROOF_COLORS[roofKind],
            roughness: 0.9,
            flatShading: true,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
          }),
        );
        const wallMat = track(
          new THREE.MeshStandardMaterial({
            color: "#c9c4b8",
            roughness: 1,
            side: THREE.DoubleSide,
          }),
        );

        for (const f of model.facets) scene.add(polygonMesh(f.points, roofMat));
        for (const g of model.gables) scene.add(polygonMesh(g, wallMat));

        // Walls: one quad per footprint edge, from grade to the eave.
        const fp = model.footprintFt;
        const wallPos: number[] = [];
        for (let i = 0; i < fp.length; i += 1) {
          const [ax, ay] = fp[i];
          const [bx, by] = fp[(i + 1) % fp.length];
          const q = [
            [ax, 0, -ay],
            [bx, 0, -by],
            [bx, wallH, -by],
            [ax, 0, -ay],
            [bx, wallH, -by],
            [ax, wallH, -ay],
          ];
          for (const p of q) wallPos.push(...p);
        }
        const wallGeo = track(new THREE.BufferGeometry());
        wallGeo.setAttribute("position", new THREE.Float32BufferAttribute(wallPos, 3));
        wallGeo.computeVertexNormals();
        scene.add(new THREE.Mesh(wallGeo, wallMat));

        // Measured lines on top of the roof.
        const linePos: number[] = [];
        const lineCol: number[] = [];
        const color = new THREE.Color();
        for (const e of model.edges) {
          color.set(EDGE_COLORS[e.kind]);
          for (const p of [v(e.a, 0.08), v(e.b, 0.08)]) {
            linePos.push(p.x, p.y, p.z);
            lineCol.push(color.r, color.g, color.b);
          }
        }
        const lineGeo = track(new THREE.BufferGeometry());
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
        lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineCol, 3));
        const lineMat = track(new THREE.LineBasicMaterial({ vertexColors: true }));
        scene.add(new THREE.LineSegments(lineGeo, lineMat));

        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const radius = box.getSize(new THREE.Vector3()).length() / 2;

        const ground = track(new THREE.CircleGeometry(radius * 2.2, 48));
        const groundMat = track(new THREE.MeshStandardMaterial({ color: "#1b1d21", roughness: 1 }));
        const groundMesh = new THREE.Mesh(ground, groundMat);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.set(center.x, -0.05, center.z);
        scene.add(groundMesh);

        scene.add(new THREE.HemisphereLight("#f4f1ea", "#23252a", 1.6));
        const sun = new THREE.DirectionalLight("#fff6e5", 2.2);
        sun.position.set(center.x - radius, radius * 2, center.z + radius * 1.5);
        scene.add(sun);

        const camera = new THREE.PerspectiveCamera(38, 1, 0.5, radius * 20);
        camera.position.set(
          center.x + radius * 1.6,
          center.y + radius * 1.4,
          center.z + radius * 1.9,
        );
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.copy(center);
        controls.enableDamping = true;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.minDistance = radius * 0.6;
        controls.maxDistance = radius * 6;
        controls.update();

        const resize = () => {
          const { clientWidth: w, clientHeight: h } = el;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(el);

        renderer.setAnimationLoop(() => {
          controls.update();
          renderer.render(scene, camera);
        });
        setStatus("ready");

        teardown = () => {
          renderer.setAnimationLoop(null);
          ro.disconnect();
          controls.dispose();
          for (const d of disposables) d.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [model, stories, roofKind]);

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-raised", className)}>
      <div ref={rootRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      {status !== "ready" && (
        <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          {status === "loading" ? "Building model…" : "3D needs WebGL — use the plan view."}
        </p>
      )}
      {status === "ready" && (
        <p className="pointer-events-none absolute bottom-2 left-3 font-mono text-xs text-faint">
          Drag to orbit · scroll to zoom
        </p>
      )}
    </div>
  );
}
