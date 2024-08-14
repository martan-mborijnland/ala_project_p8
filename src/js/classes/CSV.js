// class used to parse this SPECIFIC CSV found: '/src/media/???.csv'
class CSV
{
    // default options using static
    static options = {
        delimiter: ',',
        line_break: '\n',
        forbidden: ['', '\r'],
        replace: {
            ',': '.'
        }
    }

    // static function to parse the data
    static parse(csv_content, options)
    {
        // merge the default options with the given options
        options = Object.assign({}, this.options, options);

        let parsed = [];
        let currentSection = null;

        // get each line of the csv documents
        let lines = csv_content.split(options.line_break);
        lines = lines.map((line) => line.split(options.delimiter));

        // iterate through each line
        lines.forEach((line) => {
            // extract the first item of each line as key
            const key = line.shift().trim();
            
            // remove forbidden items
            line = line.filter(item => !options.forbidden.includes(item));


            if (key == "") {
                return;
            }

            // Check if this is a new section
            if (key.startsWith('Data ')) {
                currentSection = key.replace('Data ', '').trim().replace(':', '');
                parsed[currentSection] = {};
                return;
            }

            // replace specified substrings in each item of the line based on the options
            for (let i=0; i<line.length; i++) {
                const l = line[i];

                Object.keys(this.options.replace).forEach((key) => {
                    line[i] = l.replace(key, this.options.replace[key]);
                });
            };

            // If in a section, add the line to the section
            if (currentSection) {
                if (!parsed[currentSection][key]) {
                    parsed[currentSection][key] = [];
                }

                parsed[currentSection][key].push(...line);
            }
        });

        // return the parsed data
        return parsed;
    }
}

// Export the class for usage in module scripts
export default CSV;