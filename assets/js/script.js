let select_item = '';
let select_price = '+0';
let price = 14;

let item_list = [];

let rectboxX = 130,
	rectboxY = 320,
	rectboxWidth = 215,
	rectboxHeight = 360;

function updatePrice(price_change) {
	let regExp = /(\=|\+|\-)(\d+)/;
	let result, result_sign, result_no;

	/* Use Regular Expression to decide input
	   undefined = no change
	   '=50' = equal 50$
	   '+50' = add 50$
	   '-50' = decrease 50$
	*/
	if ((result = regExp.exec(price_change)) != null) {
		if (result.index === regExp.lastIndex) {
			regExp.lastIndex++;
		}

		result_sign = result[1];
		result_no = result[2];
	}

	if (!result_no) {

	} else if (result_sign == '=') {
		price = price_change;
	} else if (result_sign == '+') {
		price += price_change;
	} else if (result_sign == '-') {
		price -= price_change
	}

	/* Update Price */
	$('#price').html(price);
}

$(document).ready(function () {
	updatePrice();

	$('#boxEdit').show();
	$('#boxEditText, #boxEditImage').hide();

	$('.ui.accordion')
		.accordion()
		;

	$('.ui.dropdown')
		.dropdown()
		;


	$('.items').find('.item').on('click', function () {
		$('.item').removeClass('active');
		select_item = $(this).find('img').attr('src');
		select_price = $(this).attr('data-price') ?? 0;
		$(this).addClass('active');
	});

	$('#buttonAdd').on('click', function () {
		if (select_item === '') return;
		let imgObj = new Image();
		imgObj.src = select_item;
		imgObj.onload = function () {
			// start fabricJS stuff

			let image = new fabric.Image(imgObj);
			image.scale(0.1).set({
				left: 0,
				right: 0
			});
			//image.scale(getRandomNum(0.1, 0.25)).setCoords();

			image.on('selected', function () {
				let obJ = canvas.getActiveObject();

				$('#boxEdit, #boxEditText').hide();
				$('#boxEditImage').show();
			});

			image.itemPrice = select_price;

			item_list.push(image);
			canvas.setActiveObject(image).add(image);

			// end fabricJS stuff

			updatePrice(select_price);
		}
	});

	let canvas = this.__canvas = new fabric.Canvas('c');
	fabric.Object.prototype.transparentCorners = false;

	let radius = 300;

	fabric.Image.fromURL('./assets/img/shirt.png', function (img) {
		img.set({
			left: 0,
			top: 0,
			right: 0,
			selectable: false,
			hasControls: false,
			hasBorders: false
		});
		canvas.add(img).setActiveObject(img);

		rectbox = new fabric.Rect({
			width: rectboxWidth,
			height: rectboxHeight,
			left: rectboxX,
			top: rectboxY,
			stroke: 'rgba(0,0,0,0.3)',
			strokeWidth: 1,
			fill: 'rgba(0,0,0,0)',
			selectable: false,
			hasControls: false,
			hasBorders: false
		});

		canvas.add(rectbox);

		// let recttext = new fabric.Text('Zone imprimable', {
		// 	fontSize: 14,
		// 	fontFamily: 'sans-serif',
		// 	left: 185,
		// 	top: 330,
		// 	fill: 'rgba(0,0,0,0.2)',
		// 	selectable: false,
		// 	hasControls: false,
		// 	hasBorders: false
		// });

		// canvas.add(recttext);

		// Create Clip Area (Object created after this will be clipped)
		/*    let ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.rect(rectboxX, rectboxY,rectboxWidth, rectboxHeight);
			ctx.closePath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
			ctx.stroke();
			ctx.clip();*/
		// END Clip Area
	});

	$('#addTextButton').on('click', function () {
		let inText = $('#inputText').val();

		if (inText.trim() === '') {
			alert('Please type text');
			return;
		}

		let inFont = $('#inputFont').val();
		let inSize = 14;
		let inColor = $('#inputColor').val();

		let newText = new fabric.Text(inText, {
			fontSize: inSize,
			fontFamily: inFont,
			fill: inColor
		});

		newText.on('selected', function () {
			let obJ = canvas.getActiveObject();

			// Update Edit Text
			$('#editText').val(obJ.text);
			$('#uiEditFont').dropdown('set selected', obJ.fontFamily);
			$('#uiEditFont').dropdown('set value', obJ.fontFamily);
			$('#uiEditColor').dropdown('set selected', obJ.fill);
			$('#uiEditColor').dropdown('set value', obJ.fill);

			$('#boxEdit, #boxEditImage').hide();
			$('#boxEditText').show();
		});

		canvas.setActiveObject(newText).add(newText);

		item_list.push(newText);
	});

	$('#updateTextButton').on('click', function () {
		let inText = $('#editText').val();

		if (inText.trim() === '') {
			$('.trashButton').trigger('click');
			return;
		}

		let inFont = $('#editFont').val();
		let inSize = 14;
		let inColor = $('#editColor').val();

		let TexttoEdit = canvas.getActiveObject();
		TexttoEdit.setText(inText)
			.setFontFamily(inFont)
			.setFontSize(inSize)
			.setFill(inColor);

		canvas.renderAll();
	});

	document.getElementById('imgLoader').onchange = function handleImage(e) {

		// Check for available file
		if ($('#imgLoader').val().length < 1) {
			// No file Uploaded
			console.log('Aucun fichier téléchargé');
			return false;
		}

		// Check file extensions
		let fileExt = $('#imgLoader').val().split('.').pop().toLowerCase();
		if ($.inArray(fileExt, ['png', 'jpg', 'jpeg']) == -1) {
			alert('Vous ne pouvez pas télécharger ce fichier. Veuillez télécharger uniquement des images .png, .jpg ou .jpeg.');
			$('#file').val("");
			return false;
		}

		let reader = new FileReader();
		reader.onload = function (event) {
			let imgObj = new Image();
			imgObj.src = event.target.result;
			imgObj.onload = function () {
				// start fabricJS stuff

				let image = new fabric.Image(imgObj);
				image.scale(0.16).set({
					left: 0,
					right: 0,
					
				});

				image.on('selected', function () {
					let obJ = canvas.getActiveObject();

					$('#boxEdit, #boxEditText').hide();
					$('#boxEditImage').show();
				});

				//image.scale(getRandomNum(0.1, 0.25)).setCoords();
				canvas.setActiveObject(image).add(image);

				item_list.push(image);

				// end fabricJS stuff
			}

		}
		reader.readAsDataURL(e.target.files[0]);
	}

	$('.trashButton').on('click', function () {
		
		let obJ = canvas.getActiveObject();

		// Remove from item_list
		let obJindex = item_list.indexOf(obJ);
		if (obJindex > -1) {
			item_list.splice(obJindex, 1);
		}

		// Remove from canvas
		obJ.remove();
		clearSelection();

	});

	$('#resetButton').on('click', function () {
		let iLength = item_list.length;
		for (let i = 0; i < iLength; i++) {
			canvas.remove(item_list[i]);
		}
		item_list = [];
	});

	canvas.on('selection:cleared', function () {
		clearSelection();
	});

	function clearSelection() {
		$('#boxEditImage, #boxEditText').hide();
		$('#boxEdit').show();
	}

	$('#getdata-button').on('click', function () {
		//document.writeln(canvas.toSVG());
		alert(JSON.stringify(item_list));
		for (i = 0; i < item_list.length; i++) {
			let one_item = item_list[i];
			console.log(one_item, one_item.getLeft(), one_item.getTop());
		}

	});

});