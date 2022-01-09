# Online Boutique Dashboard
Simple cluster-aware web app to be exposed on [Crownlabs](https://crownlabs.polito.it).
## Objectives
- Build a web application, leverageing on the beautiful [Game of Thrones character interactions](https://codepen.io/mdeken/pen/exxawB) Pen of [Madison](https://codepen.io/mdeken) and [CSS Card Flip On Hover](https://codepen.io/ananyaneogi/pen/Ezmyeb) by [Ananya Neogi](https://codepen.io/ananyaneogi), which is capable of monitor the state of the cluster.
- Package the application in a Docker container including also kubectl used as proxy.
- Deploy the application on the cluster along with the [LiqoTech](https://github.com/liqotech) fork of [Google's Online Boutique](https://github.com/GoogleCloudPlatform/microservices-demo) microservices demo app.
- Configure a Kubernetes Ingress resource in order to allow reaching both apps from outside the cluster.

Final result will be published on [s267571.sandbox.crownlabs.polito.it/dashboard](https://s267571.sandbox.crownlabs.polito.it/dashboard).