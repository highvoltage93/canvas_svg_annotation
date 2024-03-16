import { useEffect, useRef, useState } from 'react';
// import IMAGE from '../../../shared/assets/8k.jpeg';
// import IMAGE from '../../../shared/assets/7680.jpeg';
import IMAGE from '../../../shared/assets/file.jpg';
import { CanvasWithSVG } from "canvas/canvasWithSvg";

const IDS = {
    canvas: "canvas",
    svg_container: "svg_container",
    crosshair_canvas: "crosshairCanvas",
}
interface Props {
    active: "rectangle" | "zoom_move" | "opacity"
}
const Annotation = ({ active }: Props) => {

    // const [canvas_impl, setCanvasImpl] = useState<any>();
    const [canvas_impl_new, setCanvasImplNew] = useState<any>();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvas_impl_new) return;

        if (active === "rectangle") {
            canvas_impl_new.setActiveType("rectangle")
            return
        }
        if (active === "zoom_move") {
            canvas_impl_new.setActiveType("zoom_move")
            return
        }
        if (active === "opacity") {
            canvas_impl_new.setActiveType("opacity")
            return
        }
    }, [active])

    useEffect(() => {
        if (!canvasRef.current || canvas_impl_new) return;

        let canvasWithSVGInstance = new CanvasWithSVG(canvasRef.current, IMAGE, IDS.svg_container);
        setCanvasImplNew(canvasWithSVGInstance)


        return () => {
            // canvasWithSVGInstance.unsubscribe()
        }
    }, [])


    return (
        <div className='canvas_wrapper'>
            <canvas id={IDS.canvas} width="1600" height="880" ref={canvasRef}></canvas>
            <svg id={IDS.svg_container}></svg>
            {/* <canvas id={IDS.crosshair_canvas} ref={croshairRef}></canvas> */}
        </div>
    )
}

export default Annotation;