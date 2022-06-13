    /*global chrome*/
console.log("Content Script is running...");


// function saveNotesButton(height) {
//     let btn = document.createElement("button");
//     btn.setAttribute("id", "save-notes-btn");

//     btn.textContent = "Save the notes";
//     btn.style.position = "absolute";
//     btn.style.backgroundColor = "white";
//     btn.style.border = "1px solid red";
//     btn.style.borderRadius = "5px";
//     btn.style.top = height + 5 + "px";
//     btn.style.right = "10px";
//     btn.style.fontSize = "15px"
//     btn.style.weight = "bold";
//     btn.style.cursor = "pointer";
//     document.getElementById("bounding-box").appendChild(btn);

//     btn.addEventListener("mouseover", e => {
//         console.log("没问题");
//         e.preventDefault();
//     });

//     btn.onclick = function(e) {
//         e.preventDefault();
//         console.log("是大家可能都看见阿森纳的喀纳斯可能的");
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.removeEventListener("mousedown", handleMousedown);
//             chrome.tabs.removeEventListener("mousemove", handleMousemove);
//             chrome.tabs.removeEventListener("mouseup", handleMouseup);
//         });
//     };
// }

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


function drawBoundingBox(storageNotEmpty) {
    // Allow user to draw the bounding box
    console.log("Draw a bounding box.\n")


    const rectangle = document.createElement("div");
    rectangle.setAttribute("id", "bounding-box");

    rectangle.style.position = "absolute";
    rectangle.style.backgroundColor = "rgba(0,0,0,0)";
    rectangle.style.border = "3px dashed red";
    document.body.appendChild(rectangle);

    let isDragged = false;
    let rectangleCoords = [];
    let totalHeight = 0;
    let x1, y1, x2, y2 = 0;

    const clearRectangleCoords = () => {
        rectangleCoords = [];
    };

    const addFirstRectangleCoords = coords => {
        rectangleCoords[0] = coords;
    };

    const addSecondRectangleCoords = coords => {
        rectangleCoords[1] = coords;
    };

    const reDrawRectangle = () => {
        const top = Math.min(rectangleCoords[0].y, rectangleCoords[1].y);
        const height = Math.max(rectangleCoords[0].y, rectangleCoords[1].y) - top;
        const left = Math.min(rectangleCoords[0].x, rectangleCoords[1].x);
        const width = Math.max(rectangleCoords[0].x, rectangleCoords[1].x) - left;
        x1 = left;
        y1 = top;
        x2 = left + width;
        y2 = top + height;
        rectangle.style.top = top + "px";
        rectangle.style.height = height + "px";
        rectangle.style.left = left + "px";
        rectangle.style.width = width + "px";
        totalHeight = height;
    };

    const mousedownHandler = (e) => {
        if (!isDragged) {
            let btn = document.getElementById("save-notes-btn");
            if (btn !== null) {
                btn.remove();
            }
        }
        isDragged = true;
        clearRectangleCoords();
        addFirstRectangleCoords({
            x: e.pageX,
            y: e.pageY
        });
        addSecondRectangleCoords({
            x: e.pageX,
            y: e.pageY
        });
        reDrawRectangle();
    };

    const mousemoveHandler = (e) => {
        if (isDragged) {
            addSecondRectangleCoords({
                x: e.pageX,
                y: e.pageY
            });
            reDrawRectangle();
        }
    };

    const mouseupHandler = (e) => {
        if (isDragged) {
            addSecondRectangleCoords({
                x: e.pageX,
                y: e.pageY
            });
            reDrawRectangle();
            isDragged = false;
            // saveNotesButton(totalHeight);
            let btn = document.createElement("button");
            btn.setAttribute("id", "save-notes-btn");
            btn.textContent = "Save the notes";
            btn.style.position = "absolute";
            btn.style.backgroundColor = "white";
            btn.style.border = "1px solid red";
            btn.style.borderRadius = "5px";
            btn.style.top = totalHeight + 5 + "px";
            btn.style.right = "10px";
            btn.style.fontSize = "15px"
            btn.style.weight = "bold";
            btn.style.cursor = "pointer";
            document.getElementById("bounding-box").appendChild(btn);

            btn.addEventListener("mouseover", e => {
                console.log("mouse over the button");
                window.removeEventListener("mousedown", mousedownHandler);
                window.removeEventListener("mousemove", mousemoveHandler);
                window.removeEventListener("mouseup", mouseupHandler);
            });

            btn.addEventListener("mouseleave", e => {
                console.log("mouse leaves the button");
                window.addEventListener("mousedown", mousedownHandler);
                window.addEventListener("mousemove", mousemoveHandler);
                window.addEventListener("mouseup", mouseupHandler);
            });

            btn.onclick = function(e) {
                console.log("save notes being clicked");
                let redbox = document.getElementById("bounding-box");
                let savebtn = document.getElementById("save-notes-btn");
                redbox.remove();
                savebtn.remove();
                console.log(x1);
                console.log(y1);
                console.log(x1 - window.pageXOffset);
                console.log(y1 - window.pageYOffset);

                let ele = document.elementFromPoint(x1 - window.pageXOffset,
                                                    y1 - window.pageYOffset);
                if (ele !== null) {
                    console.log(ele.nodeName);
                    console.log(ele.textContent); // true content
                    console.dir(ele);
                    console.log(ele);

                    const textContent = ele.textContent;
                    // const textContent = ele;
                    const cssStyleContent = window.getComputedStyle(ele);
                    let styleContent = {};
                    var out ="";
                    for (prop in ele.style) {
                        if (ele.style.hasOwnProperty(prop)) {
                        //   out += "  " + prop + " = '" + ele.style[prop] + "' > '" + cssStyleContent[prop] + "'\n";
                          styleContent[prop] = cssStyleContent[prop];
                        }
                      }
                      console.log(out);
                      console.log(styleContent);
                    // console.log(styleContent);
                    let captureType = "C";

                    const type = ele.getElementsByTagName("pre");
                    if (type) {
                        console.log("Capture a code snippets.");
                    } else {
                        type = ele.getElementsByTagName("img");
                        if (type) {
                            console.log("Capture an image.");
                            captureType = "I";
                            textContent = getBase64Image(ele);
                        } else {
                            console.log("Capture text");
                            captureType = "T";
                        }
                    }

                    if (storageNotEmpty) {
                        let allText = chrome.storage.local.get(["allContent"]);
                        let allStyle = chrome.storage.local.get(["allStyle"]);
                        let allType = chrome.storage.local.get(["allType"]);
                        allText.append(textContent);
                        allStyle.append(JSON.stringify(styleContent));
                        // allStyle.append(styleContent);
                        allType.append(captureType);
                        chrome.storage.local.set({"allContent": allText});
                        chrome.storage.local.set({"allStyle": allStyle});
                        chrome.storage.local.set({"allType": allType});
                    } else {
                        chrome.storage.local.set({"allContent": [textContent]});
                        chrome.storage.local.set({"allStyle": [JSON.stringify(styleContent)]});
                        chrome.storage.local.set({"allType": [captureType]});
                    }

                }

                window.removeEventListener("mousedown", mousedownHandler);
                window.removeEventListener("mousemove", mousemoveHandler);
                window.removeEventListener("mouseup", mouseupHandler);

            };

        }
    };

    // User starts to draw the bounding box
    window.addEventListener("mousedown", mousedownHandler);

    window.addEventListener("mousemove", mousemoveHandler);

    // User finishes drawing the bounding box
    window.addEventListener("mouseup", mouseupHandler);
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url :
                             "from the extension");
    if (request.greeting === "TAKE_ACTION") {
        drawBoundingBox(request.storageNotEmpty);
        sendResponse({farewell: "Done drawing a bounding box.", storage: true});
    }
});
