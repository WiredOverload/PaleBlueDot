import { scaleToWindow } from "./helpers";
// import { BoardhouseUI } from "./boardhouseui";
import { State } from "./state";
import { last } from "./helpers";
import { Entity } from "./entity";
// type Widget = BoardhouseUI.Widget;

export function setEventListeners(canvas: HTMLCanvasElement, stateStack: State[]) {
    // let hoveredWidgets: BoardhouseUI.Widget[] = [];
    // call first to scale to current window dimensions
    scaleToWindow(canvas);

    window.addEventListener("resize", function () {
        scaleToWindow(canvas);
    });

    canvas.addEventListener("mousedown", function (e: MouseEvent) {
        // traverseTreeForOnClick(last(stateStack).rootWidget, e);
        canvas.setAttribute("class", "default");
    });

    canvas.addEventListener("mousemove", function (e: MouseEvent) {
        // traverseTreeForHover(last(stateStack).rootWidget, hoveredWidgets, canvas, e);
    });

    // keyboard controls
    window.onkeydown = function(e: KeyboardEvent) {
        if (e.keyCode === 37 || e.key === 'q') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.left = true;
                }
            });
        }

        if (e.keyCode === 39 || e.key === 'e') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.right = true;
                }
            });
        }

        if (e.keyCode === 38 || e.key === 'w') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.up = true;
                }
            });
        }

        if (e.keyCode === 40 || e.key === 's') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.down = true;
                }
            });
        }

        if (e.key === 'a') {
            last(stateStack).entities.forEach(ent => {
                if (ent.control) {
                    ent.control.strafeleft = true;
                }
            });
        }

        if (e.key === 'd') {
            last(stateStack).entities.forEach(ent => {
                if (ent.control) {
                    ent.control.straferight = true;
                }
            });
        }

        if (e.code === 'Enter') {
            last(stateStack).entities.forEach(ent => {
                if (ent.control) {
                    ent.control.beacon = true;
                }
            });
        }
    }

    window.onkeyup = function(e) {
        if (e.keyCode === 37 || e.key === 'q') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.left = false;
                }
            });
        }
        if (e.keyCode === 39 || e.key === 'e') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.right = false;
                }
            });
        }

        if (e.keyCode === 38 || e.key === 'w') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.up = false;
                }
            });
        }

        if (e.keyCode === 40 || e.key === 's') {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    ent.control.down = false;
                }
            });
        }

        if (e.keyCode === 32) {
            // handle ui events first then pass to controls
            last(stateStack).entities.forEach(ent=> {
                if (ent.control !== undefined) {
                    if(ent.control.camera) {
                        ent.control.camera = false;
                    }
                    else {
                        ent.control.camera = true;
                    }
                }
            });
        }
        if (e.key === 'a') {
            last(stateStack).entities.forEach(ent => {
                if (ent.control) {
                    ent.control.strafeleft = false;
                }
            });
        }

        if (e.key === 'd') {
            last(stateStack).entities.forEach(ent => {
                if (ent.control) {
                    ent.control.straferight = false;
                }
            });
        }

        if (e.code === 'Enter') {
            last(stateStack).entities.forEach(ent => {
                if (ent.control) {
                    ent.control.beacon = false;
                }
            });
        }
    }
}

// function traverseTreeForOnClick(widget: Widget, e: MouseEvent) {
//     if (widget.style !== undefined && widget.onClick !== undefined) {
//         if (e.offsetY > widget.selfContainer.worldTransform.ty && e.offsetY < widget.selfContainer.worldTransform.ty + widget.style.height
//             && e.offsetX > widget.selfContainer.worldTransform.tx && e.offsetX < widget.selfContainer.worldTransform.tx + widget.style.width)
//         {
//             widget.onClick(e);
//         }
//     }

//     if (widget.children.length > 0) {
//         widget.children.forEach(child => {
//             traverseTreeForOnClick(child, e);
//         });
//     }
// }

// function traverseTreeForHover(widget: Widget, hoveredWidgets: Widget[], canvas: HTMLCanvasElement, e: MouseEvent) {
//     if (widget.style !== undefined && widget.onHover !== undefined && widget.offHover) {
//         let widgetIndex: number = hoveredWidgets.indexOf(widget);

//         if (e.offsetY > widget.selfContainer.worldTransform.ty && e.offsetY < widget.selfContainer.worldTransform.ty + widget.style.height
//             && e.offsetX > widget.selfContainer.worldTransform.tx && e.offsetX < widget.selfContainer.worldTransform.tx + widget.style.width)
//         {
//             if (widgetIndex === -1) {
//                 hoveredWidgets.push(widget);
//                 widget.onHover(e);
//                 canvas.setAttribute("class", "pointer");
//             }
//         }
//         else {
//             if (widgetIndex > -1) {
//                 widget.offHover(e);
//                 hoveredWidgets.splice(widgetIndex);
//                 canvas.setAttribute("class", "default");
//             }
//         }
//     }

//     if (widget.children.length > 0) {
//         widget.children.forEach(child => {
//             traverseTreeForHover(child, hoveredWidgets, canvas, e);
//         });
//     }

// }