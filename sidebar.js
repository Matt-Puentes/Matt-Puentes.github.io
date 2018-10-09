//expands sideBar
function openSideBar() {
    document.getElementById("sideBar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    // document.getElementById("canvasContainter").style.marginLeft = "250px";
}

//shrinks sideBar
function closeSideBar() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    // document.getElementById("canvasContainter").style.marginLeft = "0";

}
