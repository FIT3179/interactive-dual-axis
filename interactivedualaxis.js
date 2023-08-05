class InteractiveDualAxis {
    constructor(data, x, y1, y2, dateformat, id, rangeScale, rangeOffset, margin, w, h){
      this.data = data;
      this.id = id;
      this.x = x;
      this.y1 = y1;
      this.y2 = y2;
      this.dateformat = dateformat;
      this.container = document.getElementById(this.id);
      this.svgcontainter = document.createElement('div');
      this.uicontainer = document.createElement('div');
      
      this.uicontainerleft = document.createElement('div');
      this.uicontainerright = document.createElement('div');

      this.slider1 = document.createElement('input');
      this.slider2 = document.createElement('input');
      this.offsetinput1 = document.createElement('input');
      this.offsetinput2 = document.createElement('input');
      this.scaleMenu1 = document.createElement('select');
      this.scaleMenu2 = document.createElement('select');
      this.offsetLabel1 = document.createElement('div');
      this.offsetLabel2 = document.createElement('div');
      this.scaleLabel1 = document.createElement('div');
      this.scaleLabel2 = document.createElement('div');
      this.showlabel = false;
      this.svg;
      this.ntick = 10;
      this.yScale1;
      this.yScale2;
      this.xAxis;
      this.yAxis1;
      this.yAxis2;
      this.height;
      this.width;
      this.line1;
      this.line2;
      this.svgYAxis1;
      this.svgYAxis2;
      this.rawwidth = w;
      this.rawheight = h;
      this.rangeScale = rangeScale;
      this.rangeOffset = rangeOffset;
      this.path1;
      this.path2;
      this.margin = margin;
      this.init();
    }

    initUIs = function(){
 // Set up the dimensions of the chart
        //Range values
        this.width = this.rawwidth - this.margin.left - this.margin.right;
        this.height = this.rawheight - this.margin.top - this.margin.bottom;

        //Change the lenght of the sliders
        this.container.classList.add('ida-container');
        this.svgcontainter.classList.add('ida-svg-container');
        this.uicontainer.classList.add('ida-ui-container');
        this.uicontainerleft.classList.add('ida-ui-container-left');
        this.uicontainerright.classList.add('ida-ui-container-right');


        this.container.append(this.svgcontainter);
        this.container.append(this.uicontainer);

        this.scaleMenu1.innerHTML = "<option value='linear'>Linear</option><option value='log'>Logaritmic</option>";
        this.scaleMenu2.innerHTML = "<option value='linear'>Linear</option><option value='log'>Logaritmic</option>";

        this.slider1.type = "range";
        this.slider2.type = "range";

        this.slider1.classList.add('slider');
        this.slider2.classList.add('slider');

        this.offsetinput1.type = "range";
        this.offsetinput2.type = "range";

        this.offsetinput1.max = this.rangeOffset.max;
        this.offsetinput2.max = this.rangeOffset.max;

        this.offsetinput1.min = this.rangeOffset.min;
        this.offsetinput2.min = this.rangeOffset.min;

        this.offsetinput1.value = (this.rangeOffset.max + this.rangeOffset.min) * 0.5;
        this.offsetinput2.value = (this.rangeOffset.max + this.rangeOffset.min) * 0.5;


        this.slider1.min = this.rangeScale.min;
        this.slider2.min = this.rangeScale.min;

        this.slider1.max = this.rangeScale.max * 2;
        this.slider2.max = this.rangeScale.max * 2;
        
        this.slider1.value = this.rangeScale.max;
        this.slider2.value = this.rangeScale.max;
        

        this.slider1.style.width = this.height + 'px';
        this.slider2.style.width = this.height + 'px';
        this.offsetinput1.style.width = this.height + 'px';
        this.offsetinput2.style.width = this.height + 'px'

        this.slider1.style.display = 'block';
        this.slider2.style.display = 'block';

        this.offsetinput1.style.display = 'block';
        this.offsetinput2.style.display = 'block';

        this.uicontainerleft.append(this.scaleMenu1);
        this.uicontainerleft.append(this.offsetinput1);
        this.uicontainerleft.append(this.offsetLabel1);
        this.uicontainerleft.append(this.slider1);
        this.uicontainerleft.append(this.scaleLabel1);

        this.uicontainerright.append(this.scaleMenu2);
        this.uicontainerright.append(this.offsetinput2);
        this.uicontainerright.append(this.offsetLabel2);
        this.uicontainerright.append(this.slider2);
        this.uicontainerright.append(this.scaleLabel2);


        this.uicontainer.append(this.uicontainerleft);
        this.uicontainer.append(this.uicontainerright);


        if(!this.showlabel) {
            this.offsetLabel1.style.display = 'none';
            this.offsetLabel2.style.display = 'none';
            this.scaleLabel1.style.display = 'none';
            this.scaleLabel2.style.display = 'none';
        }
    }

    init = function(){       
        this.initUIs();
        // Create SVG container
       
        this.svg = d3.select(this.svgcontainter)
          .append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

       this.drawChart();
       
       var t = this;

       this.offsetLabel1.innerHTML = this.offsetinput1.value;
       this.offsetLabel2.innerHTML = this.offsetinput2.value;
       this.scaleLabel1.innerHTML = this.slider1.value;
       this.scaleLabel2.innerHTML = this.slider1.value;


       this.offsetinput1.oninput = function(){
             t.offsetLabel1.innerHTML = this.value;
             if(this.value <= 0 && t.scaleMenu1.value == "log"){
                this.value = 1;
            }else{
                t.updateAxis(t.offsetinput1, t.slider1, t.scaleMenu1,  t.yScale1, t.yAxis1, t.svgYAxis1, t.path1, true);
            }
       }
       this.slider1.oninput = function(){
            t.scaleLabel1.innerHTML = this.value;
            t.updateAxis(t.offsetinput1, t.slider1, t.scaleMenu1,  t.yScale1, t.yAxis1, t.svgYAxis1, t.path1, true);
       }
       this.scaleMenu1.oninput = function(){
            if(this.value == 'log' && t.offsetinput1.value <= 0){
                t.offsetinput1.value = 1;
            }
            t.updateAxis(t.offsetinput1, t.slider1, t.scaleMenu1,  t.yScale1, t.yAxis1, t.svgYAxis1, t.path1, true);
       }

       this.offsetinput2.oninput = function(){
            t.offsetLabel2.innerHTML = this.value;
            if(this.value <= 0 && t.scaleMenu2.value == "log"){
                this.value = 1;
            }else{
                t.updateAxis(t.offsetinput2, t.slider2, t.scaleMenu2,  t.yScale2, t.yAxis2, t.svgYAxis2, t.path2, false);
            }
       }
       this.slider2.oninput = function(){
            t.scaleLabel2.innerHTML = this.value;
            t.updateAxis(t.offsetinput2, t.slider2, t.scaleMenu2,  t.yScale2, t.yAxis2, t.svgYAxis2, t.path2, false);
        }
        this.scaleMenu2.oninput = function(){
            if(this.value == 'log' && t.offsetinput2.value <= 0){
                t.offsetinput2.value = 1;
            }
            t.updateAxis(t.offsetinput2, t.slider2, t.scaleMenu2,  t.yScale2, t.yAxis2, t.svgYAxis2, t.path2, false);
        }
    }

    drawChart = function(){
        // Parse the date and convert strings to dates
        const parseDate = d3.timeParse(this.dateformat);
        this.data.forEach(d => d[this.x] = parseDate(d[this.x]));

        // Define scales for x and y axes
        this.xScale = d3.scaleTime()
            .domain(d3.extent(this.data, d => d[this.x]))
            .range([0, this.width]);

        this.yScale1 = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d[this.y1])])
            .range([this.height, this.rangeScale.min]);

        this.yScale2 = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d[this.y2])])
            .range([this.height, this.rangeScale.min]);

        // Define the line functions for both lines
        this.line1 = d3.line()
            .x(d => this.xScale(d[this.x]))
            .y(d => this.yScale1(d[this.y1]));

        this.line2 = d3.line()
            .x(d => this.xScale(d[this.x]))
            .y(d => this.yScale2(d[this.y2]));

        // Draw the first line
        this.path1 = this.svg.append("path")
            .datum(this.data)
            .attr("class", "line line1") // Add the class for line1
            .attr("d", this.line1)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        // Draw the second line
        this.path2 = this.svg.append("path")
            .datum(this.data)
            .attr("class", "line line2") // Add the class for line2
            .attr("d", this.line2)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 2);

        // Create x and y axes
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis1 = d3.axisLeft(this.yScale1).ticks(this.ntick);
        this.yAxis2 = d3.axisRight(this.yScale2).ticks(this.ntick);

        // Append x and y axes to the chart
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height})`)
            .call(this.xAxis);

        this.svgYAxis1 = this.svg.append("g")
            .call(this.yAxis1);

        this.svgYAxis2 = this.svg.append("g")
            .attr("transform", `translate(${this.width}, 0)`)
            .call(this.yAxis2);   
    }
    updateAxis = function(offsetInput, slider, scaleMenu, yScale, yAxis, svgYAxis, path, left){
        var t = this;
        const value =  0.5 * slider.max / slider.value;       
        var offset = offsetInput.value;
        switch(scaleMenu.value){
            case 'linear':
                yScale = d3.scaleLinear()
                .domain([offset, (left)? d3.max(this.data, d => d[this.y1]) * value : d3.max(this.data, d => d[this.y2]) * value])
                .range([t.height, t.rangeScale.min]);
               
            break;
            case 'log':
                var val = offset;
                yScale = d3.scaleLog()
                .base(2)
                .domain([val, (left)? d3.max(this.data, d => d[this.y1]) * value : d3.max(this.data, d => d[this.y2]) * value])
                .range([t.height, t.rangeScale.min]);
            break;
        }

        const line1 = d3.line()
        .x(d => t.xScale(d[this.x]))
        .y(d => yScale((left)? d[this.y1] : d[this.y2]));


        yAxis = (left)? d3.axisLeft(yScale) : d3.axisRight(yScale);
        yAxis = yAxis.tickFormat(d3.format("s"));

        svgYAxis.call(yAxis);
        path.attr("d", line1);
    }
  }