import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ModelViewerProps {
  modelType: string;
  width?: number;
  height?: number;
  color?: string;
  rotation?: boolean;
  className?: string;
}

/**
 * Componente per visualizzare un modello 3D semplice generato dalla descrizione
 */
export function ModelViewer({
  modelType,
  width = 300,
  height = 300,
  color = '#4caf50',
  rotation = true,
  className = ''
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Mesh | null>(null);
  
  // Inizializzazione della scena Three.js
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Creazione scena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Creazione camera
    const camera = new THREE.PerspectiveCamera(
      50, // FOV
      width / height, // Aspect ratio
      0.1, // Near plane
      1000 // Far plane
    );
    cameraRef.current = camera;
    camera.position.z = 5;
    
    // Creazione renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    
    // Aggiunta luce ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Aggiunta luce direzionale
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Creazione del modello in base al tipo
    createModel(modelType, scene, color);
    
    // Animazione
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (rotation && modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up
    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelType, width, height, color, rotation]);
  
  // Funzione per creare il modello 3D in base al tipo
  const createModel = (type: string, scene: THREE.Scene, color: string) => {
    if (modelRef.current) {
      scene.remove(modelRef.current);
    }
    
    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(color),
      shininess: 100
    });
    
    let geometry: THREE.BufferGeometry;
    
    switch (type.toLowerCase()) {
      case 'bottiglia':
      case 'bottle':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
        break;
      case 'vaso':
      case 'pot':
        geometry = new THREE.CylinderGeometry(0.7, 0.5, 1.2, 32);
        break;
      case 'lampada':
      case 'lamp':
        // Creiamo una forma composita per la lampada
        const lampBase = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
        const lampNeck = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
        const lampShade = new THREE.ConeGeometry(0.8, 1, 32, 1, true);
        
        const baseMesh = new THREE.Mesh(lampBase, material);
        const neckMesh = new THREE.Mesh(lampNeck, material);
        const shadeMesh = new THREE.Mesh(lampShade, material);
        
        baseMesh.position.y = -1;
        neckMesh.position.y = -0.4;
        shadeMesh.position.y = 0.8;
        shadeMesh.rotation.x = Math.PI;
        
        const lampGroup = new THREE.Group();
        lampGroup.add(baseMesh);
        lampGroup.add(neckMesh);
        lampGroup.add(shadeMesh);
        
        scene.add(lampGroup);
        return;
      case 'scatola':
      case 'box':
        geometry = new THREE.BoxGeometry(1.5, 1, 1.5);
        break;
      case 'ciotola':
      case 'bowl':
        geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        break;
      case 'pianta':
      case 'plant':
        // Creiamo una forma composita per il vaso con pianta
        const potGeometry = new THREE.CylinderGeometry(0.6, 0.4, 0.8, 32);
        const potMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color('#a85032')
        });
        const potMesh = new THREE.Mesh(potGeometry, potMaterial);
        
        const plantGeometry = new THREE.SphereGeometry(0.8, 32, 16);
        const plantMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color('#2e8b57')
        });
        const plantMesh = new THREE.Mesh(plantGeometry, plantMaterial);
        plantMesh.position.y = 0.8;
        plantMesh.scale.set(1, 1.2, 1);
        
        const plantGroup = new THREE.Group();
        plantGroup.add(potMesh);
        plantGroup.add(plantMesh);
        
        scene.add(plantGroup);
        return;
      default:
        // Per default creiamo una forma semplice
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    modelRef.current = mesh;
    scene.add(mesh);
  };
  
  return (
    <div ref={containerRef} className={className} />
  );
}