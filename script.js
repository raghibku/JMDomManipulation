let subTotal = 0;


function manipulateDOM(selector, manipulationFn) {
	const elements = document.querySelectorAll(selector); // Use querySelectorAll to get all matching elements

	if (elements.length > 0) {
		elements.forEach((element) => {
			manipulationFn(element); // Apply the manipulation to each element
		});
		return true;
	}
	return false;
}

function handleDynamicChanges(tasks) {
	const observer = new MutationObserver(() => {
		tasks.forEach((task) => {
			const { selector, manipulationFn } = task;
			const elementChanged = manipulateDOM(selector, manipulationFn);

			// Stop observing for that element once manipulation is successful
			if (elementChanged) {
				tasks = tasks.filter((t) => t.selector !== selector); // Remove completed tasks
				if (tasks.length === 0) observer.disconnect(); // Disconnect when all tasks are done
			}
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

const ModifyProductList = (containerElement) => {
	containerElement.className = 'rebuy-product-grid card-list';

	const elements = containerElement.querySelectorAll('.rebuy-product-block');
	containerElement.innerHTML = '';
	elements.forEach((element) => {
		const mediaElement = element.querySelector('.rebuy-product-media');
		const infoElement = element.querySelector('.rebuy-product-info');
		const actionsElement = element.querySelector('.rebuy-product-actions');

		const productContainer = document.createElement('div');
		const infoActionsContainer = document.createElement('div');

		infoActionsContainer.classList.add('info-action-cont');
		infoActionsContainer.appendChild(infoElement);
		infoActionsContainer.appendChild(actionsElement);

		productContainer.classList.add('rebuy-product-redesign');
		mediaElement.classList.add('media-element');
		productContainer.appendChild(mediaElement);
		productContainer.appendChild(infoActionsContainer);
		containerElement.appendChild(productContainer);
	});
};

const MakeSlider = (containerElement) => {
	const scrollAmount = 180;
	const container = containerElement.querySelector('.rebuy-product-grid');
	const parentContainer = document.querySelector('.rebuy-widget-container');
	parentContainer.classList.add('relativeContainer');
	console.log(parentContainer);
	const leftBtn = document.createElement('button');
	containerElement.classList.add('outer-card-list');

	leftBtn.id = 'left-btn';
	leftBtn.className = 'scroll-btn';
	leftBtn.innerHTML = '&lt;';
	leftBtn.addEventListener('click', () => {
		containerElement.scrollBy({
			left: -scrollAmount,
			behavior: 'smooth',
		});
	});

	const rightBtn = document.createElement('button');

	rightBtn.id = 'right-btn';
	rightBtn.className = 'scroll-btn';
	rightBtn.innerHTML = '&gt;';
	rightBtn.addEventListener('click', () => {
		containerElement.scrollBy({
			left: scrollAmount,
			behavior: 'smooth',
		});
	});

	parentContainer.appendChild(leftBtn);
	parentContainer.appendChild(rightBtn);
};

const AddNoteModify = (parentElement) => {
	const noteElement = parentElement.querySelector('.rebuy-cart__flyout-note');
	noteElement.classList.add('add-note-design');
	const recommendationsElement = parentElement.querySelector(
		'.rebuy-cart__flyout-recommendations'
	);
	parentElement.insertBefore(noteElement, recommendationsElement.nextSibling);

	const couponDiv = document.createElement('div');
	couponDiv.innerHTML = `<div> <p>Coupon Code</p> <p>Applied at Checkout</p></div>
	<div> <p>SubTotal</p> <p>$<span id="calc_sub_total">0.00</span></p></div>
	<div> <p>Tax</p> <p>Calculated at Checkout</p></div>`;
	couponDiv.classList.add('coupon-div');

	parentElement.appendChild(couponDiv);
};

const ModifyFooter = (parentElement) => {
	var estimatedTotalDiv = document.createElement('div');

	var estimate_total_text = document.createElement('p');
	estimate_total_text.textContent = 'Estimated Total';

	var estimated_total_price_btn =
		parentElement.getElementsByClassName('button')[0];
	var estimated_total_price = estimated_total_price_btn.children[2].textContent;

	var estimate_total_price_text = document.createElement('p');
	estimate_total_price_text.textContent = estimated_total_price;

	estimatedTotalDiv.appendChild(estimate_total_text);
	estimatedTotalDiv.appendChild(estimate_total_price_text);

	estimatedTotalDiv.classList.add('estimated-div');
	parentElement.insertBefore(estimatedTotalDiv, parentElement.children[0]);

	estimated_total_price_btn.innerHTML = '<span>Checkout</span>';

	var emi = document.createElement('div');
	
	emi.innerHTML = `<p>Or 4 interest-free payments of $<span id="emi_installment_am">0</span> with shopPay</p>`;
	parentElement.appendChild(emi);
};

const CalculatePrice = () => {
	const cartList = document.getElementsByClassName(
		'rebuy-cart__flyout-items'
	)[0];

	const parentElement = cartList;
	let sum = 0;

	const cartItems = parentElement.getElementsByTagName('li');
	const cartItemsArr = Array.from(cartItems);
	cartItemsArr.forEach((cartItem) => {
		const itemPriceStr =
			cartItem.getElementsByClassName('rebuy-money')[0].children[1].textContent;
		const itemPrice = parseFloat(itemPriceStr.replace('$', ''));
		console.log(itemPrice);

		// asd
		const cartItemQuantityElement = cartItem.getElementsByClassName(
			'rebuy-cart__flyout-item-quantity-widget-label'
		)[0];
		const cartItemQuantityStr =
			cartItemQuantityElement.lastChild.textContent.trim();
		const cartItemQuantity = parseFloat(cartItemQuantityStr);

		sum = sum + itemPrice * cartItemQuantity;

		console.log(cartItemQuantity);
	});
	subTotal = sum;
	return subTotal;
};

const SubTotalPriceUpdate = () => {
	const estimated_total =
		document.getElementsByClassName('estimated-div')[0].children[1];
		
	const subTotalText =	document.getElementById("calc_sub_total")
	const emiText = document.getElementById("emi_installment_am")
	
	subTotal = CalculatePrice().toFixed(2);
	emi_amout = (subTotal/4).toFixed(2)

	// estimated_total.innerText = subTotal

	// console.log(subTotal);
	// console.log('observed change');
	setTimeout(() => {
		estimated_total.textContent = subTotal;
		subTotalText.textContent = subTotal
		emiText.textContent = emi_amout
		console.log(subTotal);
		console.log('observed change');
	}, 1000);
};

const CartEventListner = (parentElement) => {
	// const AddButtonsH = parentElement.getElementsByClassName('rebuy-button');
	// const AddButtons = Array.from(AddButtonsH);
	// AddButtons.forEach((addButton) => {
	// 	addButton.addEventListener('click', SubTotalPriceUpdate);
	// });
	// const removeButtonsH = document.getElementsByClassName(
	// 	'rebuy-cart__flyout-item-remove'
	// );
	// const removeButtons = Array.from(removeButtonsH);
	// removeButtons.forEach((removeButton) => {
	// 	removeButton.addEventListener('click', SubTotalPriceUpdate);
	// });
	const CartList = document.getElementsByClassName(
		'rebuy-cart__flyout-items'
	)[0];
	CartList.addEventListener('change', () => {
		console.log('changed');
	});
};

const observeParentDivChanges = (callbackFunction) => {
	// Select the target node (your parent div)
	const parentDiv = document.querySelector('.rebuy-cart__flyout-items');

	if (!parentDiv) {
		console.error('Parent div not found!');
		return;
	}

	// Define the callback function for mutations
	const mutationCallback = (mutationsList, observer) => {
		// Loop through each mutation
		mutationsList.forEach((mutation) => {
			if (mutation.type === 'childList') {
				console.log('A child node has been added or removed.');
				// Call the passed callback function
				callbackFunction();
			} else if (mutation.type === 'attributes') {
				console.log(`The ${mutation.attributeName} attribute was modified.`);
			}else if (mutation.type === 'characterData') {
        console.log('Text content has been modified.');
        callbackFunction();  // Detect text changes like quantity updates
      }
		});
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(mutationCallback);

	// Options for the observer (what changes to observe)
	const config = {
		childList: true, // Watch for child elements being added or removed
		attributes: true, // Watch for changes to attributes
		subtree: true, // Watch the entire subtree, not just direct children
		characterData: true, // Watch for changes in text content
	};

	// Start observing the parentDiv with the configured options
	observer.observe(parentDiv, config);

	// Optionally return the observer so it can be disconnected later
	return observer;
};

observeParentDivChanges(() => {
	SubTotalPriceUpdate(); // Function to run on change
});
// Example manipulations
const tasks = [
	{
		selector: '.rebuy-product-grid',
		manipulationFn: (element) => {
			ModifyProductList(element);
		},
	},
	{
		selector: '.rebuy-cart__flyout-content',
		manipulationFn: (element) => {
			AddNoteModify(element);
		},
	},
	{
		selector: '.rebuy-cart__flyout-footer',
		manipulationFn: (element) => {
			ModifyFooter(element);
		},
	},
	{
		selector: '.rebuy-cart__flyout-items',
		manipulationFn: () => {
			SubTotalPriceUpdate();
		},
	},
	{
		selector: '.rebuy-widget-content',
		manipulationFn: (element) => {
			MakeSlider(element);
		},
	},
	{
		selector: '.rebuy-product-grid',
		manipulationFn: (element) => {
			observeParentDivChanges(() => {
				SubTotalPriceUpdate(); // Function to run on change
			});
		},
	},
];

// Apply manipulations after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
	
	tasks.forEach((task) => manipulateDOM(task.selector, task.manipulationFn));
	handleDynamicChanges(tasks); // Handle dynamic changes
});
