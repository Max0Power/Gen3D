# 3D models from elevation data, noise and images

## Getting started

### Prerequisites

  1. [Git](https://git-scm.com/)
  2. [Java](https://jdk.java.net/)
  3. [Python](https://www.python.org)
  
### Installation

  1. Clone this repository `git clone https://github.com/Max0Power/Gen3D.git`.
  2. Go to project directory `cd Gen3D`.
  3. Switch the branch to update the working directory `git checkout gh-pages`.
  4. Run `python -m SimpleHTTPServer` to create a web server.

## Usage

  Go to `localhost:8000` on your browser to open the site.

## Debug

### Static code analysis

    Go to project directory `cd Gen3D`.
    Run analysis tool `java -jar test/rhino-1.7.12.jar test/jshint-rhino.js *.js instructions/*.js js/* modules/* sh/*.js`.
