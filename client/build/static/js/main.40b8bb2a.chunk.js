(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){e.exports=n.p+"static/media/logo.ee7cd8ed.svg"},16:function(e,t,n){},20:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(7),o=n.n(c),i=(n(14),n(1)),l=n(2),u=n(5),s=n(4),m=(n(15),n(16),n(3)),h=n.n(m),p=n(8),d=(n(18),function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={queue:[],length:0},a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=Object(p.a)(h.a.mark((function e(){var t;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getQueue();case 2:t=e.sent,console.log(t),this.setState({queue:t,length:t.length});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getQueue",value:function(){var e={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:"React POST Request Example"})};return fetch("/api",e).then((function(e){return e.json()}))}},{key:"render",value:function(){return this.state.queue?r.a.createElement("ol",null,this.state.queue.map((function(e){return r.a.createElement("li",{key:e.name},r.a.createElement("p",null,e.name),r.a.createElement("p",null,e.recording_url),r.a.createElement("p",null,e.priority))}))):r.a.createElement("div",null,"Hi!")}}]),n}(a.Component));var v=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).state={date:new Date},a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.timerId=setInterval((function(){return e.tick()}),1e3)}},{key:"componentWillUnmount",value:function(){clearInterval(this.timerId)}},{key:"tick",value:function(){this.setState({date:new Date})}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Hello, mental healthcare provider!"),r.a.createElement("h2",null,"It is ",this.state.date.toLocaleTimeString()))}}]),n}(r.a.Component),f=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement(v,null),r.a.createElement(d,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(f,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,n){e.exports=n(20)}},[[9,1,2]]]);
//# sourceMappingURL=main.40b8bb2a.chunk.js.map