import * as THREE from "three";

function createSpecialCharShape(char, size) {
  const letterSize = size;
  const shape = new THREE.Shape();

  switch (char) {
    case " ":
      // Space - return null to skip
      return null;

    case "!":
      // Main vertical line
      shape.moveTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, letterSize * 0.1);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.1);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);

      // Dot at top
      const exclamationDot = new THREE.Shape();
      exclamationDot.moveTo(-letterSize * 0.1, letterSize * 0.3);
      exclamationDot.lineTo(letterSize * 0.1, letterSize * 0.3);
      exclamationDot.lineTo(letterSize * 0.1, letterSize * 0.5);
      exclamationDot.lineTo(-letterSize * 0.1, letterSize * 0.5);
      exclamationDot.lineTo(-letterSize * 0.1, letterSize * 0.3);

      // Combine shapes
      return [shape, exclamationDot];

    case "?":
      // Question mark curve
      shape.moveTo(-letterSize * 0.3, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.5);
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
        -letterSize * 0.1
      );
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.2);
      shape.lineTo(letterSize * 0.0, -letterSize * 0.2);
      shape.quadraticCurveTo(
        letterSize * 0.25,
        -letterSize * 0.15,
        letterSize * 0.25,
        letterSize * 0.2
      );
      shape.quadraticCurveTo(
        letterSize * 0.25,
        letterSize * 0.3,
        letterSize * 0.1,
        letterSize * 0.35
      );
      shape.lineTo(-letterSize * 0.1, letterSize * 0.35);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.3);

      // Question mark dot
      const questionDot = new THREE.Shape();
      questionDot.moveTo(-letterSize * 0.1, -letterSize * 0.4);
      questionDot.lineTo(letterSize * 0.1, -letterSize * 0.4);
      questionDot.lineTo(letterSize * 0.1, -letterSize * 0.5);
      questionDot.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      questionDot.lineTo(-letterSize * 0.1, -letterSize * 0.4);

      return [shape, questionDot];

    case ".":
      // Period/dot
      shape.moveTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      break;

    case ",":
      // Comma
      shape.moveTo(-letterSize * 0.1, -letterSize * 0.4);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.4);
      shape.lineTo(letterSize * 0.05, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.05, -letterSize * 0.6);
      shape.lineTo(-letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.4);
      break;

    case ":":
      // Colon - two dots
      const topDot = new THREE.Shape();
      topDot.moveTo(-letterSize * 0.1, letterSize * 0.2);
      topDot.lineTo(letterSize * 0.1, letterSize * 0.2);
      topDot.lineTo(letterSize * 0.1, letterSize * 0.4);
      topDot.lineTo(-letterSize * 0.1, letterSize * 0.4);
      topDot.lineTo(-letterSize * 0.1, letterSize * 0.2);

      const bottomDot = new THREE.Shape();
      bottomDot.moveTo(-letterSize * 0.1, -letterSize * 0.4);
      bottomDot.lineTo(letterSize * 0.1, -letterSize * 0.4);
      bottomDot.lineTo(letterSize * 0.1, -letterSize * 0.2);
      bottomDot.lineTo(-letterSize * 0.1, -letterSize * 0.2);
      bottomDot.lineTo(-letterSize * 0.1, -letterSize * 0.4);

      return [topDot, bottomDot];

    case ";":
      // Semicolon
      const semiTopDot = new THREE.Shape();
      semiTopDot.moveTo(-letterSize * 0.1, letterSize * 0.2);
      semiTopDot.lineTo(letterSize * 0.1, letterSize * 0.2);
      semiTopDot.lineTo(letterSize * 0.1, letterSize * 0.4);
      semiTopDot.lineTo(-letterSize * 0.1, letterSize * 0.4);
      semiTopDot.lineTo(-letterSize * 0.1, letterSize * 0.2);

      const semiComma = new THREE.Shape();
      semiComma.moveTo(-letterSize * 0.1, -letterSize * 0.2);
      semiComma.lineTo(letterSize * 0.1, -letterSize * 0.2);
      semiComma.lineTo(letterSize * 0.05, -letterSize * 0.1);
      semiComma.lineTo(-letterSize * 0.05, -letterSize * 0.4);
      semiComma.lineTo(-letterSize * 0.15, -letterSize * 0.3);
      semiComma.lineTo(-letterSize * 0.1, -letterSize * 0.2);

      return [semiTopDot, semiComma];

    case "-":
      // Hyphen/minus
      shape.moveTo(-letterSize * 0.3, -letterSize * 0.05);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.05);
      shape.lineTo(letterSize * 0.3, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.05);
      break;

    case "+":
      // Plus sign - horizontal bar
      shape.moveTo(-letterSize * 0.3, -letterSize * 0.05);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.05);
      shape.lineTo(letterSize * 0.3, letterSize * 0.05);
      shape.lineTo(letterSize * 0.05, letterSize * 0.05);
      shape.lineTo(letterSize * 0.05, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.05, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.05, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.05);
      shape.lineTo(-letterSize * 0.05, -letterSize * 0.05);
      shape.lineTo(-letterSize * 0.05, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.05, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.05, -letterSize * 0.05);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.05);
      break;

    case "=":
      // Equals sign - two horizontal bars
      const topBar = new THREE.Shape();
      topBar.moveTo(-letterSize * 0.3, letterSize * 0.15);
      topBar.lineTo(letterSize * 0.3, letterSize * 0.15);
      topBar.lineTo(letterSize * 0.3, letterSize * 0.25);
      topBar.lineTo(-letterSize * 0.3, letterSize * 0.25);
      topBar.lineTo(-letterSize * 0.3, letterSize * 0.15);

      const bottomBar = new THREE.Shape();
      bottomBar.moveTo(-letterSize * 0.3, -letterSize * 0.25);
      bottomBar.lineTo(letterSize * 0.3, -letterSize * 0.25);
      bottomBar.lineTo(letterSize * 0.3, -letterSize * 0.15);
      bottomBar.lineTo(-letterSize * 0.3, -letterSize * 0.15);
      bottomBar.lineTo(-letterSize * 0.3, -letterSize * 0.25);

      return [topBar, bottomBar];

    case "#":
      // Hash/pound sign
      shape.moveTo(-letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.05, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.05, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.05, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.15, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.2);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.2);
      shape.lineTo(-letterSize * 0.25, letterSize * 0.1);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.1);
      shape.lineTo(-letterSize * 0.4, 0);
      shape.lineTo(-letterSize * 0.3, 0);
      shape.lineTo(-letterSize * 0.35, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.25, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, 0);
      shape.lineTo(letterSize * 0.4, 0);
      shape.lineTo(letterSize * 0.4, letterSize * 0.1);
      shape.lineTo(letterSize * 0.25, letterSize * 0.1);
      shape.lineTo(letterSize * 0.3, letterSize * 0.2);
      shape.lineTo(letterSize * 0.4, letterSize * 0.2);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(letterSize * 0.35, letterSize * 0.3);
      shape.lineTo(letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.05, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.05, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.15, -letterSize * 0.5);
      break;

    case "&":
      // Ampersand (simplified)
      shape.moveTo(-letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        letterSize * 0.4,
        -letterSize * 0.4,
        letterSize * 0.2
      );
      shape.quadraticCurveTo(-letterSize * 0.4, 0, -letterSize * 0.2, 0);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.2);
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        -letterSize * 0.1,
        -letterSize * 0.3,
        letterSize * 0.1
      );
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        letterSize * 0.3,
        -letterSize * 0.1,
        letterSize * 0.4
      );
      shape.quadraticCurveTo(
        letterSize * 0.1,
        letterSize * 0.5,
        letterSize * 0.2,
        letterSize * 0.3
      );
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.0, letterSize * 0.3);
      shape.quadraticCurveTo(
        -letterSize * 0.1,
        letterSize * 0.25,
        -letterSize * 0.2,
        letterSize * 0.5
      );
      break;

    default:
      // Default rectangle for unknown characters
      shape.moveTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      break;
  }

  return shape;
}
