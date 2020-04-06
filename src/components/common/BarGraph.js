import React,{Component} from 'react'
import * as d3 from "d3";

class BarGraph extends Component{
    constructor(props){
        super(props)
        this.myRef = React.createRef();
    }
   
   componentDidMount(){
       const {data}=this.props
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 250 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);
    var svg = d3.select(this.myRef.current).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");


                  
                  
                    x.domain(data.map(function(d) { return d.field; }));
                    y.domain([0, d3.max(data, function(d) { return d.value; })]);
                   
                        data.forEach(function(d) {
                          d.value = +d.value;
                        });
                      
                        // Scale the range of the data in the domains
                        x.domain(data.map(function(d) { return d.field; }));
                        y.domain([0, d3.max(data, function(d) { return d.value; })]);
                        svg.selectAll(".bar")
                            .data(data)
                            .enter().append("rect")
                            .classed('background', true)
                            // .attr("class", "bar")
                            .attr("x", function(d) { return x(d.field); })
                            .attr("width", 70)
                            .attr("y", function(d) { return y(d.value); })
                            .attr("height", function(d) { return height - y(d.value); })
                            .attr('fill', function(d){return d.color})
                       
                       
                       
                       
                        svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));
                  
                    // add the y Axis
                    svg.append("g")
                        .call(d3.axisLeft(y));

                        svg.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - margin.left)
                        .attr("x",0 - (height / 2 ))
                        .attr("dy", "1em")
                        .style("text-anchor", "middle")
                        .style("font-size","14px")
                        .text("Marks");  
            }
    
    render(){
        return(<div className="bar-graph" ref={this.myRef}></div>)
    }
}
export default BarGraph;