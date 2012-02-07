



function count_points(paths){
	var count = 0;
	for(var i=0; i < paths.length; i++){
		count += paths[i].segments.length;
	}
	return count
	
}

function mutate_once(paths, amplitude){
	console.log("MUTATE", count_points(paths));
	var mut_index = Math.floor(Math.random() * count_points(paths)	);
	console.log("MUTATE", count_points(paths), mut_index);

	var count = 0;
	for(var i=0; i < paths.length; i++){
		var l = paths[i].segments.length
		if(mut_index < count + l){
			var seg = paths[i].segments[mut_index - count];
			console.log("SEG", seg);
			seg.point.x += (Math.random()*2-1) * amplitude;
			seg.point.y += (Math.random()*2-1) * amplitude;
			return;
		}
		count += l;
	}	
}

function mutate_shapes(paths, rate, amplitude){
	mutations = Math.ceil(count_points(paths) * rate);
	for(var n=0; n < mutations; n++){
		mutate_once(paths, amplitude);
	}
	
	
}



var components = {


    mutation_rate: {
        type: 'slider', label: 'Mutation Rate',
        value: 5, range: [0, 1]
    },


	mutation_size: {
        type: 'number', label: 'Mutation Size',
        value: 5, range: [0, 100],
        steppers: true, units: 'point'
    },
    mutate: { 
        type: 'button', label: 'Mutate',
        value:'Mutate',
        onClick: function() {
			console.log(values.components.mutation_rate.value);
            mutate_shapes(document.selectedItems, values.components.mutation_rate.value, values.components.mutation_size.value);
        }
    },

};
var values = new Palette('Button Item', components);