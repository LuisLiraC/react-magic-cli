# React Magic CLI

A CLI for React to generate projects and components using the command line.

## Installation
```bash
npm i -g react-magic-cli
```

## Usage
```bash
rg <command> <resource-name>

rg new MyProject

rg component MyComponent
```

## Alternative command
if you have ripgrep installed you can use these alternatives
```bash
rcg <command> <resource-name>
react-magic <command> <resource-name>
```

Current commands
```txt
new                     Creates a project based on your answers
component               Creates a component in ./src/components
```

## Examples
Project generation
```bash
rg new MyProject
```
![](https://imgur.com/AjwMqOD.gif)
Simple component generation
```bash
rg component MyComponent
```
![](https://imgur.com/BS5PmI4.gif)
