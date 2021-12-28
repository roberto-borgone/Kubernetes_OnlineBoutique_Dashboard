# Online Boutique Dashboard
Simple cluster-aware web app to be exposed on [Crownlabs](https://crownlabs.polito.it).
## Objectives
- Build a web application, leverageing on the beautiful [Game of Thrones character interactions](https://codepen.io/mdeken/pen/exxawB) Pen of [Madison](https://codepen.io/mdeken), which is capable of monitor the state of the cluster.
- Package the application in a Docker container by mean of multi-stage building including also kubectl used as proxy.
- Deploy the application on the cluster along with [Google's Online Boutique](https://github.com/liqotech/microservices-demo) microservices demo app.
- Configure a Kubernetes Ingress resource in order to allow reaching both apps from outside the cluster.

Final result will be published on [s267571.sandbox.crownlabs.polito.it](https://s267571.sandbox.crownlabs.polito.it).