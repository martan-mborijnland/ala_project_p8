// importing custom classes
import Card from "./Card.js";
import Cards from "./Cards.js";


// class used to change the modes of the page like view & edit modes.
class Modes
{
    // class required variables (default mode is modes[0])
    settings_default = {
        container: undefined,
        modes: ['view', 'edit'],
        card_settings: {}
    }
    settings = {};

    buttons = {};


    // constructor called when creating this class
    constructor(grid, settings)
    {
        // checking if grid is set or found
        if (!grid) {
            throw new Error("Grid was not found in HTML body!");
        }
        this.grid = grid;

        // checking if settings are set and of type object
        if (!settings || typeof settings != 'object') {
            throw new Error('Expected an object as settings, but received ' + (settings === null ? 'null' : typeof settings));
        }
        // merging default settings with new settings
        this.settings = Object.assign({}, this.settings_default, settings);

        // checking if container was set in settings
        if (!this.settings.container) {
            throw new Error("Container must be set inside the settings.");
        }

        // check if mode is currently undefined and if so set it to the default mode
        if (this.get_current() == "undefined") {
            sessionStorage.setItem('mode', this.settings.modes[0]);
        }

        // initializing the modes, event listeners and styling
        this.initialize();
        this.eventListeners();
        this.style();
    }

    // get the current mode
    get_current()
    {
        return sessionStorage.getItem('mode') || this.settings.modes[0];
    }

    // switch the current mode to the next mode
    switch_current()
    {
        // getting index of current mode
        const index = this.settings.modes.indexOf(this.get_current());

        // getting the next index (or first if above modes length)
        const desired_index = (index) => (index + 1) % this.settings.modes.length;
        const desired = this.settings.modes[desired_index(index)];

        // saving new mode to session storage
        sessionStorage.setItem('mode', desired);

        // returning new mode
        return desired;
    }

    // creating the add-widget widget (creating new widgets)
    create_addWidgetWidget()
    {
        // delete the old add-widget widget
        this.delete_addWidgetWidgets();

        // creating new a widget
        this.add_widget = this.grid.addWidget({
            w: 2, h: 2,
            noResize: true, noMove: true,
            content: `<i class="bi bi-plus"></i>`
        });
        this.add_widget.id = 'add_widget';

        // creating an event listener to add a new widget at the add-widget widget position on click
        this.add_widget.addEventListener('click', (event) => {
            // new settings
            const settings = Object.assign({}, this.settings.card_settings);
            settings.gridstack.x = this.add_widget.gridstackNode.x;
            settings.gridstack.y = this.add_widget.gridstackNode.y;

            // new card
            const card = new Card(this.grid, settings);
            
            // adding the new card to the local array of cards
            window.cards.push(card);

            // styling the modes
            this.style();
            
            // creating a new widget and removing the previous one (see line: 79)
            this.create_addWidgetWidget();
        });
    }

    // delete the previous add-widget widget
    delete_addWidgetWidgets() {
        // finding all other add-widget widgets
        const widgets = document.querySelectorAll('#add_widget');
        if (widgets && widgets.length > 0) {
            widgets.forEach((widget) => {
                // removing each one found from the gridstack
                this.grid.removeWidget(widget);
            });
        }
    }

    // initializer for the current modes
    initialize()
    {
        const parent = this.settings.container;

        // creating button for edit mode
        const btn_edit = document.createElement('button');
        btn_edit.setAttribute('mode', 'view');
        btn_edit.classList.add("edit");
        btn_edit.innerText = "Edit";

        // creating button for cancel inside edit mode
        const btn_cancel = document.createElement('button');
        btn_cancel.setAttribute('mode', 'edit');
        btn_cancel.classList.add("cancel");
        btn_cancel.innerText = "Cancel";

        // creating button for apply inside edit mode
        const btn_apply = document.createElement('button');
        btn_apply.setAttribute('mode', 'edit');
        btn_apply.classList.add("apply");
        btn_apply.innerText = "Apply";

        // appending the edit button to the container
        parent.appendChild(btn_edit);
        this.buttons['edit'] = btn_edit;

        // appending the cancel button to the container
        parent.appendChild(btn_cancel);
        this.buttons['cancel'] = btn_cancel;

        // appending the apply button to the container
        parent.appendChild(btn_apply);
        this.buttons['apply'] = btn_apply;
    }

    // adding the event listeners
    eventListeners()
    {
        // switching to edit mode
        this.buttons['edit'].addEventListener('click', (event) => {
            this.switch_current();
            this.style();
        });
        
        // switching out of edit mode by canceling all changes
        this.buttons['cancel'].addEventListener('click', (event) => {
            this.switch_current();
            this.style();

            // checking if the cards array is found on the window
            if (window.cards && window.cards.length > 0) {
                window.cards.forEach((card) => {
                    // reverting every data and input value
                    card.revert_inputs();
                });
            }
        });
        
        // switching out of edit mode by applying all changes
        this.buttons['apply'].addEventListener('click', (event) => {
            this.switch_current();
            this.style();

            // updating every data with the value of the inputs of each card
            window.cards.forEach((card) => {
                card.update_inputs();
            });

            // saving the current card layout to the local storage
            Cards.save_layout();
        });
    }

    // used for displaying every element to the correct mode
    style(mode)
    {
        // check if desired mode was set otherwise use the current mode
        if (!mode) {
            mode = this.get_current();
        }

        // selecting all edit and view mode elements
        const elements_edit = document.querySelectorAll('[mode=edit]');
        const elements_view = document.querySelectorAll('[mode=view]');

        // changing all edit element to the desired mode display level
        elements_edit.forEach((el) => {
            if (mode == 'view') {
                el.classList.add('hidden');
            } else {
                el.classList.remove('hidden');
            }
        });

        // changing all view element to the desired mode display level
        elements_view.forEach((el) => {
            if (mode == 'view') {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        // display the add-widget widget in edit mode
        // change the grid to be moveable and resizeable or not.
        if (mode == 'view') {
            this.delete_addWidgetWidgets();
            this.grid.disable();
        } else if (mode == 'edit') {
            this.create_addWidgetWidget();
            this.grid.enable();
        }
    }
}

// Export the class for usage in module scripts
export default Modes;