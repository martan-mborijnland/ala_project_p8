// class for managing the cards and their layouts
class Cards
{
    // export all cards settings
    static export_cards() 
    {
        // have it export only the card's data using the card.export() function
        const export_ = []
        window.cards.forEach((card) => {
            export_.push(card.export());
        });
        return export_;
    }

    // saving layout to localstorage
    static save_layout()
    {
        // calling local function to get the card layout
        const layout = this.export_cards() || [];

        // saving it to localstorage
        localStorage.setItem('gridstackLayout', JSON.stringify(layout));

        // returning the layout
        return layout;
    }

    // taking layout from localstorage
    static get_layout()
    {
        // parsing the found data or returning an empty array
        const layout = JSON.parse(localStorage.getItem('gridstackLayout')) || []
        return layout;
    }
}

// Export the class for usage in module scripts
export default Cards;