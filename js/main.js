var draggedId;
var draggedIndex;
var droppableId;
var droppableIndex;
var draggedItem;
var itemsLength = $(".draggable-item").length;
console.log(itemsLength);

$(".draggable-item").draggable({
    addClasses: false,
    start: function(event, ui) {
        draggedItem = $(event.target);
        draggedId = draggedItem.attr("id");
        console.log("draged id" + draggedId)
        draggedIndex = draggedItem.index();
        console.log("dragged index " + draggedIndex);
    }
});

$(".draggable-item").droppable({
    addClasses: false,
    over: function(event, ui) {
        var droppableItem = $(event.target)
        droppableId = droppableItem.attr("id");
        droppableIndex = droppableItem.index();
        console.log("droppable id " + droppableId);
        console.log("droppableIndex " + droppableIndex);
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
        if (draggedIndex > droppableIndex && draggedIndex == itemsLength-1) {
        	console.log("dropping last");
            draggedItem.insertBefore(dropTarget)
            setTimeout(function() {
                $(".draggable-elements-wrapper").append(dropTarget)
            }, 1)
        }
        if (draggedIndex > droppableIndex) {
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
    }
});