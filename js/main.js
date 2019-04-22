var draggedId; /*id del objeto que arrastramos*/
var draggedIndex; /*índice del objeto que arrastramos*/
var droppableId; /*id del objeto que recibe*/
var droppableIndex; /*índice del objeto que recibe*/
var draggedItem; /*Nodo html que es arrastrado*/
var allowDrop; /*Bandera para restringir que un elemento pueda ser soltado*/
var draggedSize; /*tamaño del objeto arrastrado*/
var droppableSize; /*tamaño del objeto que recibe*/
var rowSlots; /*cantidad de espacios ocupados antes de la posición del elemento que recibe*/
var itemsLength = $(".draggable-item").length; /*Catidad de items en el grid*/
console.log(itemsLength);



$(".draggable-item").draggable({
    addClasses: false,
    start: function(event, ui) { /*cuando se inicia el arrastre de un objeto*/
        draggedItem = $(event.target); /*creamos un objeto con el item que estamos arrastrando*/
        draggedId = draggedItem.attr("id"); /*obtenemos el id del objeto que arrastramos*/
        draggedSize = draggedItem.data("item-size") /*obtenemos el tamaño del elemento que arrastramos*/
        draggedIndex = draggedItem.index(); /*obtenemos el índice del objeto que arrastramos*/
        //draggedItem.addClass("being-dragged")
        console.log(draggedItem.position());
        var widgetPosition = draggedItem.offset();
        var widgetWidth = draggedItem.outerWidth();
        var widgetHeight = draggedItem.outerHeight();
        $(".drag-shadow").css({
            top:widgetPosition.top,
            left:widgetPosition.left,
            width:widgetWidth,
            height:widgetHeight,
            opacity:1
        })
    },
    stop: function(event, ui) { /*cuando termina el arrastre de un objeto*/
        if ($(".overed").length == 0) { /*si el item fue soltado fuera de otro item*/
            $(event.target).css({ /*lo regresa a su posición original*/
                top: 0,
                left: 0
            })
        }
        $(".drag-shadow").css({
            opacity:0
        })
    }
});

$(".draggable-item").droppable({
    addClasses: false,
    tolerance: "pointer",
    /*activa un elemento receptor cuando el cursor se encuentra dentro de él*/
    over: function(event, ui) {
        var sizeDifference;
        var totalIndex = 0;
        allowDrop = true; /*permite soltar solo si hay un item sobre otro item*/
        var droppableItem = $(event.target); /*creamos el objeto receptor*/
        droppableSize = droppableItem.data("item-size"); /*obtenemos el tamaño del objeto receptor*/
        $(droppableItem).prevAll(".draggable-item").each(function(element){
            //console.log($(this).data("item-size"));
            var siblingSize = $(this).data("item-size");
            totalIndex = totalIndex + siblingSize;
            //console.log("total index " + totalIndex)
        })
        $(".draggable-item").removeClass("overed");
        setTimeout(function() {
            droppableItem.addClass("overed"); /*agregamos una clase para mostrar sobre qué elemento nos encontramos*/
        }, 20);
        droppableId = droppableItem.attr("id"); /*obtenemos el id del objeto receptor*/
        droppableIndex = droppableItem.index(); /*obtenemos el índice del objeto receptor*/
        slotCount = countSlots(droppableItem, droppableIndex); /*mediante una función obtenemos la cantidad de espacios ocupados antes del elemento receptor (ver notas en la función)*/
        rowSlots = slotCount + draggedItem.data("item-size"); /*sumamos los slots ocupados antes del receptor y el tamaño del item arrastrado para validar si cabe en la misma fila*/
        if (draggedSize < droppableSize) { /*impedimos que un objeto se pueda soltar sobre un receptor que sea más grande que él*/
            console.log("allow drop denied");
            allowDrop = false;
        }
        else if (((totalIndex + droppableSize) % 4 == 0) && draggedSize > droppableSize){
            console.log("estas sobre el último de la fila y el dragged es mayor que el dropped");
            allowDrop = false;
            //alert("son del mismo tamaño");
        }
        else if (draggedSize > droppableSize) {
            console.log("over largo sobre elemento corto");
            sizeDifference = draggedSize - droppableSize;
            console.log("size difference " + sizeDifference);
            var nextItem = droppableItem.next(".draggable-item");
            var nextItemSize = nextItem.data("item-size");
            if (sizeDifference == nextItemSize) {
                setTimeout(function() {
                    nextItem.addClass("overed")
                }, 20)
            } else {
                setTimeout(function() {
                    nextItem.addClass("overed")
                    sizeDifference = sizeDifference - nextItemSize;
                    console.log("new Size difference "+sizeDifference)
                    nextItem = nextItem.next(".draggable-item");
                    nextItemSize = nextItem.data("item-size");
                    if (sizeDifference == nextItemSize) {
                        setTimeout(function() {
                            nextItem.addClass("overed");
                            if(sizeDifference - nextItemSize != 0){
                                console.log("sigue sin caber");
                                allowDrop = false;
                            } else {
                                console.log("ya cupo");
                                allowDrop = true;
                            }
                        }, 20)
                    } else {
                        allowDrop = false;
                    }
                }, 20)
            }
        }
    },
    out: function(event, ui) {
        $(".draggable-item").removeClass("overed");
    },
    drop: function(event, ui) {
        var dropTarget = $(event.target); /*creamos un objeto con el elemento al que se le esta soltando otro elemento (basicamente es el mismo que al que se le hizo over)*/
        dropTarget.css({ /*cambiamos el color de algún elemento sobre el que ya se haya soltado otro elemento*/
            background: "gray"
        })
        draggedItem.css({ /*cambiamos el color del elemento que se soltó sobre el receptor*/
            top: 0,
            left: 0,
            background: "teal"
        });

        /*todas estas condiciones se ejecutan al momento de soltar un item sobre otro, esa es la definición
        del evento drop*/

        if (allowDrop == false) { /*si por alguna razón no esta permitido el drop, regresa el item arrastrado a su posición original*/
            draggedItem.css({
                top: 0,
                left: 0
            })
        }
        /*else if (draggedSize != droppableSize && rowSlots % 4 != 0) { 
                   console.log("no cabe en la fila");
                   draggedItem.css({
                       top: 0,
                       left: 0,
                       background: "red"
                   });
               }*/
        else if ($(".draggable-item.overed").length > 1){
            console.log("elemento largo sobre corto");
            var draggableArray = [];
            $(".draggable-item.overed").each(function(index,element){
                draggableArray.push($(element).attr("id"));
            });
            if(draggedIndex > droppableIndex){
                console.log("esta después");
                draggedItem.insertBefore(dropTarget)
                for (i =0; i< draggableArray.length; i++){
                    console.log(draggableArray);
                    console.log(draggableArray[i]);
                    $("#"+draggableArray[i]).insertBefore($(".draggable-item:eq(" + (draggedIndex + 1) + ")")); /*tenemos que sumarle 1 a la posición en la que será insertado el elemento receptor, debido al orden en el que se ejecuta el intercambio de elementos*/
                }
            } else {
                console.log("esta antes");
                draggedItem.insertBefore(dropTarget)
                draggableArray.reverse();
                for (i =0; i< draggableArray.length; i++){
                    console.log(draggableArray);
                    console.log(draggableArray[i]);
                    $("#"+draggableArray[i]).insertBefore($(".draggable-item:eq(" + (draggedIndex) + ")")); /*tenemos que sumarle 1 a la posición en la que será insertado el elemento receptor, debido al orden en el que se ejecuta el intercambio de elementos*/
                }
            }
            
        }
        else if (draggedIndex > droppableIndex && draggedIndex == itemsLength - 1) { /* si el elemento que arrastramos es el último item en el grid, tenemos que hacer un tratamiento especial*/
            draggedItem.insertBefore(dropTarget) /*insertamos el elemento que arrastramos en la posición del elemento receptor*/
            setTimeout(function() {
                $(".draggable-elements-wrapper").append(dropTarget); /*el elemento receptor lo reinsertamos hasta el final del grid*/
            }, 1)
        } else if (draggedIndex > droppableIndex) { /*si el elemento que arrastramos está después del elemento receptor, tenemos que modificar la posición en la que será insertado*/
            draggedItem.insertBefore(dropTarget)
            setTimeout(function() {
                dropTarget.insertBefore($(".draggable-item:eq(" + (draggedIndex + 1) + ")")); /*tenemos que sumarle 1 a la posición en la que será insertado el elemento receptor, debido al orden en el que se ejecuta el intercambio de elementos*/
            }, 1)
        } else { /*y este es el default*/
            draggedItem.insertBefore(dropTarget) /*insertamos el elemento arrastrado un lugar antes de donde se encontraba el elemento receptor*/
            setTimeout(function() {
                dropTarget.insertBefore($(".draggable-item:eq(" + draggedIndex + ")")); /*insertamos el elemento receptor un lugar antes de la posición en la que se encontraba el elemento que arrastramos*/
            }, 1)
        }
        $(".draggable-item").removeClass("overed") /*quitamos la clase overed a todos los elementos*/
    }
});

function countSlots(overedItem, overedIndex) {
    /*Esta función sirve para contar los espacios ocupados antes del elemento receptor, esto es para
    poder contar si el elemento que estamos arrastrando cabe en esa fila o se sale del borde*/
    var slotCount = 0;
    for (i = 0; i < overedIndex; i++) {
        var currentItemSize = $(".draggable-item:eq(" + i + ")").data("item-size");
        slotCount = slotCount + currentItemSize;
    }
    return slotCount
}