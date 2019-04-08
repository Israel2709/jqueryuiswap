var draggedId;
var draggedIndex;
var droppableId;
var droppableIndex;
var draggedItem;
var allowDrop;
var draggedSize;
var droppableSize;
var rowSlots;
var itemsLength = $(".draggable-item").length;
console.log(itemsLength);

$(".draggable-item").draggable({
    addClasses: false,
    start: function(event, ui) {
        draggedItem = $(event.target);
        draggedId = draggedItem.attr("id");
        draggedSize = draggedItem.data("item-size")
        console.log("draged id" + draggedId)
        draggedIndex = draggedItem.index();
        console.log("dragged index " + draggedIndex);
    }
});

$(".draggable-item").droppable({
    addClasses: false,
    over: function(event, ui) {
    	allowDrop = true;
        var droppableItem = $(event.target);
        var droppableSize = droppableItem.data("item-size");
        droppableItem.addClass("overed")
        droppableId = droppableItem.attr("id");
        droppableIndex = droppableItem.index();
        console.log("dragged size "+draggedSize);
        console.log("droppable-size "+droppableSize);
        if(draggedSize < droppableSize){
        	allowDrop = false;
        	console.log(allowDrop)
        }
        slotCount = countSlots(droppableItem, droppableIndex);
        console.log("slotCount "+slotCount)
        rowSlots = slotCount + draggedItem.data("item-size");
        console.log(rowSlots % 4)
    },
    out: function(event,ui){
    	$(event.target).removeClass("overed")
    },
    drop: function(event, ui) {
        var dropTarget = $(event.target);
        console.log("dg index " + draggedIndex);
        dropTarget.css({
            background: "gray"
        })
        draggedItem.css({
            top: 0,
            left: 0,
            background: "teal"
        });
        console.log("overed lenght "+ $(".overed").length)

        if (allowDrop == false){
        	draggedItem.css({
        		top:0,
        		left:0
        	})
        } else if(rowSlots % 4 != 0){
        	draggedItem.css({
	            top: 0,
	            left: 0,
	            background: "red"
	        });
        } else if($(".overed").length == 0){
        	draggedItem.css({
        		top:0,
        		left:0
        	})
        } else if (draggedIndex > droppableIndex && draggedIndex == itemsLength-1) {
        	console.log("dropping last");
            draggedItem.insertBefore(dropTarget)
            setTimeout(function() {
                $(".draggable-elements-wrapper").append(dropTarget)
            }, 1)
        } else if (draggedIndex > droppableIndex) {
            draggedItem.insertBefore(dropTarget)
            setTimeout(function() {
                dropTarget.insertBefore($(".draggable-item:eq(" + (draggedIndex + 1) + ")"));
            }, 1)
        } else {
            draggedItem.insertBefore(dropTarget)
            setTimeout(function() {
                dropTarget.insertBefore($(".draggable-item:eq(" + draggedIndex + ")"));
            }, 1)
        }
        $(".draggable-item").removeClass("overed")
    }
});

function countSlots(overedItem, overedIndex){
	var slotCount = 0;
	for(i = 0; i < overedIndex; i++){
		var currentItemSize = $(".draggable-item:eq("+i+")").data("item-size");
		slotCount = slotCount + currentItemSize;
		console.log(slotCount)
	}
	return slotCount
}