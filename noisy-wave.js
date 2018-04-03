var shape
var noiser
function main(){
  //Some constants
  var width = 900;
  var height = 500;
  var equilateralAltitude = Math.sqrt(3.0) / 2.0;
  var triangleScale = 70;
  var patch_width = width * 1.5;
  var patch_height = height * 1.5;

  noiser = new seen.Simplex3D(shape);
  //Create a "Patch" shape, which is a bunch of triangles
  shape = seen.Shapes.patch(
    patch_width/triangleScale/equilateralAltitude, patch_height/triangleScale)
  //Scale the patch appropriately
  shape = shape.scale(triangleScale)
  //Translate the patch so that it's in the center of the room
  shape = shape.translate(-patch_width / 2, -patch_height / 2 + 80)
  //Rotates the shape a little, makes it look nice
  shape = shape.rotx(-0.3);

  //Apply random colors to the plane
  seen.Colors.randomSurfaces2(shape);

  //Create a new shape
  scene = new seen.Scene({
    //Add our shape to the default model
    model: seen.Models["default"]().add(shape),
    //Create a viewport, make it centered.
    viewport: seen.Viewports.center(width, height)
  });

  //Get the context of the rendering
  context = seen.Context('seen-canvas', scene).render();

  //Assign an animation to the context
  context.animate().onBefore(animateFunction).start();
}

function animateFunction(t) {
  ref = shape.surfaces;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    surf = ref[i];
    ref1 = surf.points;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      p = ref1[j];
      p.z = 4 * noiser.noise(p.x / 8, p.y / 8, t * 1e-4);
    }
    results.push(surf.dirty = true);
  }
  return results;
}
