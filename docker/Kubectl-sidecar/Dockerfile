FROM alpine:3.15.0

# kubectl installation and krew plugin installation for oidc-login in crownlabs cluster
ENV KUBECONFIG=/usr/share/kubectl/config
ADD https://dl.k8s.io/release/v1.22.4/bin/linux/amd64/kubectl  https://github.com/kubernetes-sigs/krew/releases/latest/download/krew-linux_amd64.tar.gz /usr/share/kubectl/

RUN apk add git && \
cd /usr/share/kubectl && \
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
tar zxf "krew-linux_amd64.tar.gz" && \
./krew-linux_amd64 install krew && \
rm krew-linux_amd64.tar.gz && \
cp /root/.krew/bin/kubectl-krew /usr/local/bin/ && \
kubectl krew install oidc-login && \
cp /root/.krew/bin/kubectl-oidc_login /usr/local/bin/

COPY config /usr/share/kubectl/

EXPOSE 8001

CMD kubectl proxy --address= 0.0.0.0 --accept-hosts='.*'
