# Instalação do mkcert (via Chocolatey)

Se você está usando o Windows, o (Chocolatey)[https://community.chocolatey.org/] é o gerenciador de pacotes mais simples para instalar o (mkcert)[https://github.com/FiloSottile/mkcert].

Pré-requisito: Instalar o Chocolatey
Se você ainda não tem o Chocolatey, abra o PowerShell como Administrador e execute o seguinte comando:

> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

Instalar o mkcert
Com o Chocolatey instalado, instale o mkcert executando no terminal:

> choco install mkcert

# Instalação da Autoridade Certificadora Local (CA)

O mkcert precisa ser configurado uma única vez para criar sua própria Autoridade Certificadora (CA) e instalá-la no seu sistema operacional e navegadores. Isso garante que os certificados gerados sejam confiáveis.
Execute o comando:

> mkcert -install

# Geração do Certificado SSL/TLS

Agora você pode gerar o par de certificado e chave privada para o seu ambiente de desenvolvimento (localhost).

a. Criar a Pasta de Destino
Navegue até a raiz do seu projeto e crie a pasta certs onde os arquivos serão salvos.

- mkdir certs
- cd certs

b. Gerar o Certificado
Execute o mkcert especificando onde salvar o certificado (.pem) e a chave (-key.pem).

> mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
