import {Circle} from 'react-konva';
import React from 'react'

export default function CanvasLine (props) {
  return (
    <Circle
      x={props.x}
      y={props.y}
      radius={5}
      fill="black"
      sceneFunc={function (ctx) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(props.lineTo.x, props.lineTo.y)
        ctx.strokeStyle = '#ff0101'
        ctx.stroke()
        ctx.closePath()
        ctx.fillStrokeShape(this)
      }}
    />
  )
}

