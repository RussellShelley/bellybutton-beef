function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
  var samples = data.samples
  console.log(samples)
  // 4. Create a variable that filters the samples for the object with the desired sample number.
  var filteredSample = samples.filter(sampleObj => sampleObj.id == sample);
  console.log(filteredSample)
// 1. Create a variable that filters the metadata array for the object with the desired sample number
  var metadata = data.metadata;
  var metaResultArray = metadata.filter(sampleObj => sampleObj.id == sample);

  //  5. Create a variable that holds the first sample in the array.
  var filteredObj = filteredSample[0];
  console.log(filteredObj);

   // 2. Create a variable that holds the first sample in the metadata array.
   var metaResult = metaResultArray[0];
  console.log(metaResult)
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otu_id = filteredObj.otu_ids;
  console.log(otu_id);

  var otu_labels = filteredObj.otu_labels;
    console.log(otu_labels)
  var sample_values = filteredObj.sample_values;
  console.log(sample_values);

  // 3. Create a variable that holds the washing frequency.
  var wfreq = parseFloat(metaResult.wfreq);
  console.log(wfreq)
  
    





    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
  var top10ids = otu_id.slice(0,10);
  console.log(top10ids);


  var yticks = top10ids.map(otu =>  `OTU ${otu}`).reverse();
 
  console.log(yticks);



    // 8. Create the trace for the bar chart. 
  var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      text: otu_labels.slice(0,10).reverse(),
      orientation: "h"
    };
  var barData = [trace];   
   
    // 9. Create the layout for the bar chart. 
  var barLayout = { title :{ text: "Top 10 Bacteria Cultures Found", 
                    font: {size: 24} },
                    width: 600,
                    height: 400
     
   };
// 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot("bar", barData, barLayout);
//  };



// 1. Create the trace for the bubble chart.
var trace1 = {
  x: otu_id,
  y: sample_values,
  text: otu_labels,
  mode: 'markers',
  marker:{colorscale: 'Portland',
    color: otu_id,
    size: sample_values
  }
  
};  

var bubbleData = [trace1]; 
    

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = { title :{ 
                          text: "Bacteria Cultures Per Sample", 
                          font: {size: 24} },
                         xaxis : {title: "OTU IDs"},
                         hovermode:'closest',
                         height: 600,
                         width: 1200

      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

     
        // 4. Create the trace for the gauge chart.
   var trace3 = {
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Scrubs per Week", font: { size: 20 } },
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ]
      }

    };      
       var gaugeData = [trace3]; 
    
    
    // 5. Create the layout for the gauge chart.
   
    var gaugeLayout = { title :{ text: "Belly Button Washing Frequency", 
                                  font: {size: 24} },
                        width: 600,
                        height: 400 };
  

    // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
  }
