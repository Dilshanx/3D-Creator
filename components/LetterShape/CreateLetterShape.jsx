import * as THREE from "three";

export default function CreateLetterShape(char, size) {
  const letterSize = size;
  const shape = new THREE.Shape();

  switch (char.toUpperCase()) {
    case "A":
      shape.moveTo(-letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(0, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.15, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.15, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.5, -letterSize * 0.5);
      break;

    case "B":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        letterSize * 0.4,
        letterSize * 0.4,
        letterSize * 0.25
      );
      shape.lineTo(letterSize * 0.3, letterSize * 0.05);
      shape.lineTo(letterSize * 0.4, letterSize * 0.05);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.1,
        letterSize * 0.5,
        -letterSize * 0.25
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.5,
        letterSize * 0.2,
        -letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "C":
      shape.moveTo(letterSize * 0.3, letterSize * 0.4);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        letterSize * 0.3,
        -letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        -letterSize * 0.3,
        -letterSize * 0.2,
        -letterSize * 0.5
      );
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.4);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.3);
      shape.quadraticCurveTo(
        -letterSize * 0.2,
        -letterSize * 0.3,
        -letterSize * 0.3,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.2,
        letterSize * 0.3,
        letterSize * 0.1,
        letterSize * 0.3
      );
      shape.lineTo(letterSize * 0.3, letterSize * 0.4);
      break;

    case "D":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        letterSize * 0.3,
        letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.3,
        letterSize * 0.1,
        -letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "E":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "F":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "G":
      shape.moveTo(letterSize * 0.3, letterSize * 0.4);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        letterSize * 0.3,
        -letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        -letterSize * 0.3,
        -letterSize * 0.2,
        -letterSize * 0.5
      );
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.1, letterSize * 0.1);
      shape.lineTo(letterSize * 0.3, letterSize * 0.1);
      shape.lineTo(letterSize * 0.3, letterSize * 0.4);
      break;

    case "H":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "I":
      shape.moveTo(-letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(letterSize * 0.3, letterSize * 0.3);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.3);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.5);
      break;

    case "J":
      shape.moveTo(-letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.2);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.5,
        -letterSize * 0.1,
        -letterSize * 0.5
      );
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        -letterSize * 0.5,
        -letterSize * 0.4,
        -letterSize * 0.2
      );
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.2);
      shape.quadraticCurveTo(
        -letterSize * 0.2,
        -letterSize * 0.3,
        -letterSize * 0.1,
        -letterSize * 0.3
      );
      shape.quadraticCurveTo(0, -letterSize * 0.3, 0, -letterSize * 0.2);
      shape.lineTo(0, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.5);
      break;

    case "K":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.05, letterSize * 0.05);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "L":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "M":
      shape.moveTo(-letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.1);
      shape.lineTo(letterSize * 0.1, letterSize * 0.1);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, letterSize * 0.1);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.1);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.5, -letterSize * 0.5);
      break;

    case "N":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "O":
      shape.moveTo(-letterSize * 0.3, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        letterSize * 0.3,
        -letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        -letterSize * 0.3,
        -letterSize * 0.3,
        -letterSize * 0.5
      );
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.3,
        letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        letterSize * 0.3,
        letterSize * 0.3,
        letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      // Inner hole
      shape.moveTo(-letterSize * 0.2, letterSize * 0.3);
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        letterSize * 0.2,
        -letterSize * 0.3,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        -letterSize * 0.2,
        -letterSize * 0.2,
        -letterSize * 0.3
      );
      shape.lineTo(letterSize * 0.2, -letterSize * 0.3);
      shape.quadraticCurveTo(
        letterSize * 0.3,
        -letterSize * 0.2,
        letterSize * 0.3,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.3,
        letterSize * 0.2,
        letterSize * 0.2,
        letterSize * 0.3
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.3);
      break;

    case "P":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        letterSize * 0.3,
        letterSize * 0.5,
        letterSize * 0.1
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.1,
        letterSize * 0.2,
        -letterSize * 0.1
      );
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "Q":
      shape.moveTo(-letterSize * 0.3, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        letterSize * 0.3,
        -letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        -letterSize * 0.3,
        -letterSize * 0.3,
        -letterSize * 0.5
      );
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.3,
        letterSize * 0.5,
        0
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        letterSize * 0.3,
        letterSize * 0.3,
        letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      // Tail
      shape.moveTo(letterSize * 0.2, -letterSize * 0.2);
      shape.lineTo(letterSize * 0.5, -letterSize * 0.6);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.6);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.4);
      break;

    case "R":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        letterSize * 0.3,
        letterSize * 0.5,
        letterSize * 0.1
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.1,
        letterSize * 0.2,
        -letterSize * 0.1
      );
      shape.lineTo(letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.05, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      break;

    case "S":
      shape.moveTo(letterSize * 0.3, letterSize * 0.4);
      shape.lineTo(letterSize * 0.1, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        letterSize * 0.4,
        -letterSize * 0.5,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        -letterSize * 0.5,
        letterSize * 0.05,
        -letterSize * 0.2,
        letterSize * 0.05
      );
      shape.lineTo(letterSize * 0.2, letterSize * 0.05);
      shape.quadraticCurveTo(
        letterSize * 0.5,
        letterSize * 0.05,
        letterSize * 0.5,
        -letterSize * 0.05
      );
      shape.quadraticCurveTo(
        letterSize * 0.5,
        -letterSize * 0.25,
        letterSize * 0.2,
        -letterSize * 0.5
      );
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.4);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.3);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.3,
        letterSize * 0.3,
        -letterSize * 0.05
      );
      shape.quadraticCurveTo(
        letterSize * 0.3,
        letterSize * 0.1,
        0,
        letterSize * 0.1
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.1);
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        letterSize * 0.1,
        -letterSize * 0.3,
        letterSize * 0.25
      );
      shape.quadraticCurveTo(
        -letterSize * 0.3,
        letterSize * 0.3,
        -letterSize * 0.1,
        letterSize * 0.3
      );
      shape.lineTo(letterSize * 0.3, letterSize * 0.4);
      break;

    case "T":
      shape.moveTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      break;

    case "U":
      shape.moveTo(-letterSize * 0.4, -letterSize * 0.2);
      shape.quadraticCurveTo(
        -letterSize * 0.4,
        -letterSize * 0.5,
        -letterSize * 0.1,
        -letterSize * 0.5
      );
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.quadraticCurveTo(
        letterSize * 0.4,
        -letterSize * 0.5,
        letterSize * 0.4,
        -letterSize * 0.2
      );
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.2);
      shape.quadraticCurveTo(
        letterSize * 0.2,
        -letterSize * 0.3,
        letterSize * 0.1,
        -letterSize * 0.3
      );
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.3);
      shape.quadraticCurveTo(
        -letterSize * 0.2,
        -letterSize * 0.3,
        -letterSize * 0.2,
        -letterSize * 0.2
      );
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.2);
      break;

    case "V":
      shape.moveTo(-letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(0, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.5, letterSize * 0.5);
      break;

    case "W":
      shape.moveTo(-letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.05, -letterSize * 0.2);
      shape.lineTo(-letterSize * 0.05, -letterSize * 0.2);
      shape.lineTo(-letterSize * 0.15, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.5, letterSize * 0.5);
      break;

    case "X":
      shape.moveTo(-letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(0, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(letterSize * 0.15, letterSize * 0.05);
      shape.lineTo(letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(0, -letterSize * 0.1);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.5, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.15, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.5, letterSize * 0.5);
      break;

    case "Y":
      shape.moveTo(-letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(0, letterSize * 0.1);
      shape.lineTo(letterSize * 0.2, letterSize * 0.5);
      shape.lineTo(letterSize * 0.5, letterSize * 0.5);
      shape.lineTo(letterSize * 0.1, letterSize * 0.05);
      shape.lineTo(letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.1, letterSize * 0.05);
      shape.lineTo(-letterSize * 0.5, letterSize * 0.5);
      break;

    case "Z":
      shape.moveTo(-letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.5);
      shape.lineTo(letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.2, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.5);
      shape.lineTo(-letterSize * 0.4, -letterSize * 0.3);
      shape.lineTo(letterSize * 0.2, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.3);
      shape.lineTo(-letterSize * 0.4, letterSize * 0.5);
      break;

    default:
      // Default rectangle for unimplemented letters
      shape.moveTo(-letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, -letterSize * 0.5);
      shape.lineTo(letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, letterSize * 0.5);
      shape.lineTo(-letterSize * 0.3, -letterSize * 0.5);
      break;
  }

  return shape;
}
