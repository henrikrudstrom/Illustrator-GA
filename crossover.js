
function get_dividing_line(shape){
	var bound = new Path.Rectangle(shape.bounds);
	var param = Math.random();
	var p1 = bound.getPoint(param * bound.length);
	var p2 = bound.getPoint(((param + 0.5) % 1)* bound.length);
	var line = new Path.Line(p1, p2);
	bound.remove();
	return line;
}

function divide_shape(shape, line){
	var shape = shape.clone()
	var bound = new Path.Rectangle(shape.bounds);
	var divided_bound = Pathfinder.divide([bound,line]);
	var half_bound = divided_bound.children[0].copyTo(document);
	var half_shape = Pathfinder.intersect([half_bound, shape])
	
	console.log(half_shape);
	
	half_bound.remove();
	bound.remove();
	divided_bound.remove();
	return half_shape;
}

function intersect_bounds(shape, line){
	//finds the outermost points of the line that split the shape in two
	var isects = line.getIntersections(shape)
	//console.log(isects);
	var min_loc = isects[0];
	var min_param = 100;
	var max_loc = isects[0];
	var max_param = 0;
	
	for(var k=0; k < isects.length;k++){
		//console.log("S"+isects[k].parameter);
		if(isects[k].parameter > max_loc.parameter){
			max_loc = isects[k];
		}
		if(isects[k].parameter < min_loc.parameter){
			min_loc = isects[k];
		}
	}
	return [min_loc.point, max_loc.point]
}

function get_transformation(pta1, pta2, ptb1, ptb2){
	var translation = pta1 - ptb1;
	var vA = pta2 - pta1
	var vB = ptb2 - ptb1
	var rotation = vA.getDirectedAngle(vB)
	var scale = vA.length / vB.length;
	
	var m = new Matrix();
	m.rotate(rotation, pta1);
	m.scale(scale, pta1);
	m.translate(translation);
	return m;
}

function crossover(shape1, shape2){
	if(shape1 == undefined || shape2 == undefined){
		Dialog.alert("plese select two paths");
		return;
	}
	if(!shape1.closed || !shape2.closed){
		Dialog.alert("both shapes must be closed (last point must be equal to the first point of the path)");
		return;
	}
	
	
	var l1 = get_dividing_line(shape1);
	var half1 = divide_shape(shape1, l1);
	var pts1 = intersect_bounds(shape1, l1);
	
	var l2 = get_dividing_line(shape2);
	var half2 = divide_shape(shape2, l2);
	var pts2 = intersect_bounds(shape2, l2);
	
	var matrix = get_transformation(pts1[0], pts1[1], pts2[0], pts2[1]);
	half2.transform(matrix);
	
	var merged = Pathfinder.merge([half1, half2])
	
	
	merged.translate([100, 100])

	
	
}


function check_closed(shape){
	if(shape.segments[0].point != shape.segments[shape.segments.length-1].point){
		console.log("shape needs to be closed");
		console.log(shape.segments[0].point, shape.segments[shape.segments.length-1].point)
	}
	
	
}


function test_orient_triangles(tri1, tri2){
	var pt1 = tri1.segments[0].point;
	var pt2 = tri1.segments[1].point;
	var pt3 = tri2.segments[0].point;
	var pt4 = tri2.segments[1].point;
	var matrix = get_transformation(pt1, pt2, pt3, pt4)
	tri2.transform(matrix)

}

//check_closed(document.selectedItems[0])
crossover(document.selectedItems[1], document.selectedItems[0])
//test_orient_triangles(document.selectedItems[1], document.selectedItems[0])
//split(document.selectedItems[1], document.selectedItems[0]);
//divide_shape(document.selectedItems[0]);