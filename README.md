# React Magic CLI

A CLI for React to generate projects and components using the command line.

## Installation
```bash
npm i -g react-magic-cli
```

## Usage
```bash
rgc <command> <resource-name>
react-magic <command> <resource-name>

rgc new MyProject

react-magic component MyComponent
```

Current commands
```txt
new                     Creates a project based on your answers
component               Creates a component in ./src/components
hook                    Creates a custo hook in ./src/hooks
```

## Examples
Project generation
```bash
rgc new MyProject
```
![](https://imgur.com/oKUolA5.gif)
Simple component generation
```bash
rgc component MyComponent
```
![](https://imgur.com/mXVjJOY.gif)
