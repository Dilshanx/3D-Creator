import * as THREE from "three";

export default function CreateNumberShape(char, size) {
  const letterSize = size;
  const shape = new THREE.Shape();
  const thickness = letterSize * 0.15; // Line thickness

  switch (char) {
    case "0":
      // Outer oval
      shape.moveTo(0, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        letterSize * 0.5,
        -letterSize * 0.4,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        -letterSize * 0.5,
        0,
        -letterSize * 0.5
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        -letterSize * 0.5,
        letterSize * 0.4,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.5,
        0,
        letterSize * 0.5
      );

      // Inner hole
      const hole = new THREE.Path();
      hole.moveTo(0, letterSize * 0.3);
      hole.quadraticCurveTo(
        -letterSize * 0.25,
        letterSize * 0.3,
        -letterSize * 0.25,
        0
      );
      hole.quadraticCurveTo(
        -letterSize * 0.25,
        -letterSize * 0.3,
        0,
        -letterSize * 0.3
      );
      hole.quadraticCurveTo(
        letterSize * 0.25,
        -letterSize * 0.3,
        letterSize * 0.25,
        0
      );
      hole.quadraticCurveTo(
        letterSize * 0.25,
        letterSize * 0.3,
        0,
        letterSize * 0.3
      );
      shape.holes.push(hole);
      break;

    case "1":
      shape.moveTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, letterSize * 0.4);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.4);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      break;

    case "2":
      shape.moveTo(-letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.4,
        letterSize * 0.4,
        letterSize * 0.2
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        0,
        letterSize * 0.1,
        -letterSize * 0.2
      );
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.0, letterSize * 0.1);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        letterSize * 0.2,
        letterSize * 0.2,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.2,
        letterSize * 0.3,
        letterSize * 0.1,
        letterSize * 0.3
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.3);
      break;

    case "3":
      shape.moveTo(-letterSize * 0.3, letterSize * 0.4);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.4,
        letterSize * 0.4,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.05,
        letterSize * 0.2,
        letterSize * 0.05
      );
      shape.lineTo(letterSize * 0.25, letterSize * 0.05);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.05,
        letterSize * 0.4,
        -letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        -letterSize * 0.4,
        letterSize * 0.2,
        -letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.4);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.3);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.3,
        letterSize * 0.2,
        -letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.15,
        letterSize * 0.15,
        -letterSize * 0.15
      );
      shape.lineTo(letterSize * 0.1, -letterSize * 0.15);
      shape.lineTo(letterSize * 0.15, letterSize * 0.15);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        letterSize * 0.15,
        letterSize * 0.2,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.2,
        letterSize * 0.3,
        letterSize * 0.1,
        letterSize * 0.3
      );
      shape.lineTo(-letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.4);
      break;

    case "4":
      shape.moveTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.1);
      shape.lineTo(letterSize * 0.4, letterSize * 0.1);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      break;

    case "5":
      shape.moveTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.1);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.05,
        letterSize * 0.4,
        -letterSize * 0.2
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        -letterSize * 0.5,
        letterSize * 0.1,
        -letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.4);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.3);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.3,
        letterSize * 0.2,
        -letterSize * 0.2
      );
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.1,
        letterSize * 0.1,
        -letterSize * 0.1
      );
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      break;

    case "6":
      shape.moveTo(letterSize * 0.2, letterSize * 0.4);
      shape.lineTo(letterSize * 0.0, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        letterSize * 0.3,
        -letterSize * 0.4,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        -letterSize * 0.3,
        -letterSize * 0.2,
        -letterSize * 0.5
      );
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        -letterSize * 0.3,
        letterSize * 0.4,
        -letterSize * 0.1
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.1,
        letterSize * 0.2,
        letterSize * 0.1
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.quadraticCurveTo(
        -letterSize * 0.25,
        letterSize * 0.1,
        -letterSize * 0.25,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.25,
        -letterSize * 0.3,
        0,
        -letterSize * 0.3
      );
      shape.lineTo(letterSize * 0.2, -letterSize * 0.3);
      shape.quadraticCurveTo(
        letterSize * 0.25,
        -letterSize * 0.2,
        letterSize * 0.25,
        -letterSize * 0.1
      );
      shape.quadraticCurveTo(
        letterSize * 0.25,
        letterSize * 0.05,
        letterSize * 0.1,
        letterSize * 0.05
      );
      shape.lineTo(-letterSize * 0.1, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(letterSize * 0.0, letterSize * 0.3);
      shape.lineTo(letterSize * 0.2, letterSize * 0.4);
      break;

    case "7":
      shape.moveTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(letterSize * 0.0, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      break;

    case "8":
      // Top circle
      shape.moveTo(0, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        letterSize * 0.45,
        -letterSize * 0.3,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        letterSize * 0.05,
        0,
        letterSize * 0.05
      );
      shape.quadraticCurveTo(
        letterSize * 0.3,
        letterSize * 0.05,
        letterSize * 0.3,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.3,
        letterSize * 0.45,
        0,
        letterSize * 0.5
      );

      // Bottom circle
      shape.moveTo(0, letterSize * 0.05);
      shape.quadraticCurveTo(
        -letterSize * 0.35,
        letterSize * 0.0,
        -letterSize * 0.35,
        -letterSize * 0.25
      );
      shape.quadraticCurveTo(
        -letterSize * 0.35,
        -letterSize * 0.5,
        0,
        -letterSize * 0.5
      );
      shape.quadraticCurveTo(
        letterSize * 0.35,
        -letterSize * 0.5,
        letterSize * 0.35,
        -letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.35,
        letterSize * 0.0,
        0,
        letterSize * 0.05
      );

      // Top hole
      const topHole = new THREE.Path();
      topHole.moveTo(0, letterSize * 0.35);
      topHole.quadraticCurveTo(
        -letterSize * 0.15,
        letterSize * 0.32,
        -letterSize * 0.15,
        letterSize * 0.25
      );
      topHole.quadraticCurveTo(
        -letterSize * 0.15,
        letterSize * 0.18,
        0,
        letterSize * 0.18
      );
      topHole.quadraticCurveTo(
        letterSize * 0.15,
        letterSize * 0.18,
        letterSize * 0.15,
        letterSize * 0.25
      );
      topHole.quadraticCurveTo(
        letterSize * 0.15,
        letterSize * 0.32,
        0,
        letterSize * 0.35
      );
      shape.holes.push(topHole);

      // Bottom hole
      const bottomHole = new THREE.Path();
      bottomHole.moveTo(0, -letterSize * 0.08);
      bottomHole.quadraticCurveTo(
        -letterSize * 0.2,
        -letterSize * 0.12,
        -letterSize * 0.2,
        -letterSize * 0.25
      );
      bottomHole.quadraticCurveTo(
        -letterSize * 0.2,
        -letterSize * 0.38,
        0,
        -letterSize * 0.38
      );
      bottomHole.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.38,
        letterSize * 0.2,
        -letterSize * 0.25
      );
      bottomHole.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.12,
        0,
        -letterSize * 0.08
      );
      shape.holes.push(bottomHole);
      break;

    case "9":
      shape.moveTo(-letterSize * 0.2, -letterSize * 0.4);
      shape.lineTo(-letterSize * 0.0, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        -letterSize * 0.3,
        letterSize * 0.4,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.3,
        letterSize * 0.2,
        letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        letterSize * 0.4,
        -letterSize * 0.4,
        letterSize * 0.1
      );
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        -letterSize * 0.1,
        -letterSize * 0.2,
        -letterSize * 0.1
      );
      shape.lineTo(letterSize * 0.2, -letterSize * 0.1);
      shape.quadraticCurveTo(
        letterSize * 0.25,
        -letterSize * 0.1,
        letterSize * 0.25,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.25,
        letterSize * 0.3,
        0,
        letterSize * 0.3
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      shape.quadraticCurveTo(
        -letterSize * 0.25,
        letterSize * 0.2,
        -letterSize * 0.25,
        letterSize * 0.1
      );
      shape.quadraticCurveTo(
        -letterSize * 0.25,
        -letterSize * 0.05,
        -letterSize * 0.1,
        -letterSize * 0.05
      );
      shape.lineTo(letterSize * 0.1, -letterSize * 0.05);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.0, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.4);
      break;

    default:
      // Default rectangle for unknown numbers
      shape.moveTo(-letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.5);
      break;
  }

  return shape;
}
