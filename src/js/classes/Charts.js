// importing chartjs
import "../../../node_modules/chart.js/dist/chart.umd.js";

// used to generate chart options for chartjs
class Charts
{
    // each avaliable chart
    static avaliable_charts = ['gauge', 'line', 'radar', 'bar'];

    // used to generate the options
    static generate(type, parameters, data)
    {
        // type to all lower characters
        type = type.toLowerCase();

        // check if chart type is avaliable
        if (!this.avaliable_charts.includes(type)) {
            throw new Error(`Chart type "${type}" is not avaliable, please check \`Charts.avaliable_charts\`.`)
        }

        // create options
        const options = this[type](parameters);

        // return the newly created options
        return options;
    }

    // check if all parameters are set
    static check_parameters(required, current)
    {
        // throw an error if not all parameters were set
        if (!current || !required.every(key => current.hasOwnProperty(key))) {
            throw new Error(`Expected the required parameteres ${JSON.stringify(required)}.`);
        }
    }

    // generates the options for a gauge chart
    static gauge(parameters) 
    {
        // specify and check the parameters if the required parameters were found
        const required_parameters = ['current', 'max'];
        this.check_parameters(required_parameters, parameters);

        // parse data used to create the gauge correctly
        const data = [parameters.current, (parameters.max - parameters.current)]

        // return the specific options for this chart type
        return {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [parameters.color || "Blue", "Grey"],
                    borderColor: "rgba(0,0,0,0)"
                }]
            },
            options: {
                rotation: 270,
                circumference: 180,
                response: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        };
    }

    // generates the options for a line chart
    static line(parameters)
    {
        // specify and check the parameters if the required parameters were found
        const required_parameters = ['labels', 'data'];
        this.check_parameters(required_parameters, parameters); 

        // return the specific options for this chart type
        return {
            type: 'line',
            data: {
                labels: parameters.labels,
                datasets: [{
                    data: parameters.data,  
                    fill: false,
                    borderColor: parameters.color || 'rgb(75, 192, 192)',
                    backgroundColor: "rgba(0,0,0,0)",
                    tension: 0.1
                }]
            },
            options: {
                response: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }; 
    }

    // generates the options for a radar chart
    static radar(parameters)
    {
        // specify and check the parameters if the required parameters were found
        const required_parameters = ['labels', 'data'];
        this.check_parameters(required_parameters, parameters);

        // return the specific options for this chart type
        return {
            type: 'radar',
            data: {
                labels: parameters.labels,
                datasets: [{
                    data: parameters.data,  
                    fill: false,
                    borderColor: parameters.color || 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                response: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }; 
    }

    // generates the options for a bar chart
    static bar(parameters)
    {
        // specify and check the parameters if the required parameters were found
        const required_parameters = ['labels', 'data'];
        this.check_parameters(required_parameters, parameters);

        // return the specific options for this chart type
        return {
            type: 'bar',
            data: {
                labels: parameters.labels,
                datasets: [{
                    data: parameters.data,  
                    fill: false,
                    borderColor: "rgba(0,0,0,0)",
                    backgroundColor: parameters.color || 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                response: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }; 
    }
}

// Export the class for usage in module scripts
export default Charts;