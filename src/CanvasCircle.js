import {Circle} from 'react-konva';
import React from 'react'

export default function CanvasCircle (props) {
  return (
    <Circle
      x={props.x}
      y={props.y}
      radius={3}
      fill="black"
    />
  )
}

