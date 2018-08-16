# neotools

## Summary

The aim is to have all Neo Smart Economy API or project implementation primitives to be part of a unix-style command line chainable toolset. With this in place one would have easy lookup of various operations and functions, reference implementation, and clear calling syntax and usage examples. A common problem for me, working in c#, nodejs, and python, is that I'm always having to go back to one of those projects, navigate their specific layout, then locate a piece or example to be sure I'm doing something right. Instead of trying to get everyone to agree on a standard I thought why not implement a bunch of their primitives in a standard way to unify that reference. Besides, being able to call a lot of those directly from command line would be really useful for all kinds of stuff.(edited)
So for example, you might have a file structure like src/ and under it you'd have nodejs, python, and c#. Then under each of those you might have modules demonstrating how to use things like neon-js, neo, or boa. Those modules would also facilitate a stdio cli mechanism.

## Project Version and Status

Version: 0.0.1

Status: Documenting goals and defining standards

Next: Write implementation example template

## Primary Goals
This project has two major goals:

1. Provide a command line tool for each Neo Smart Economy system function primitive. In example,
each function useful for an account, a wallet, a transaction, etc should be contained in its own module with
the ability to call it directly from the command line, by itself, and retrieve a result. Each CLI invocation should
enable stdio behavior so commands may be chained together to form command line scripts.

2. Provide simple and clear examples of each Neo Smart Economy system function primitive to offer reusable, standard
reference implementations for each language or API. This will accelerate community understanding and implementation adoption.

## Requirements

1. Source hierarchy *must* be organized by language/implementation/function in adherence with familiar and relevant project naming conventions.

2. Modules *must* be composable, where applicable.

3. A registry of implementations names *must* be maintained and consistent with community.

4. A standard format for argument passing and return values *must* be maintained across *all* modules. Composability between
implementations is ideal to facilitate complimentary capabilities where necessary and possible.

5. Each module *must* be callable from command line with the capability to read argument input from its standard input and the ability to write operation results to its standard output. Use of standard error would be ideal.

6. Each module *must* provide a description including its registered parent project name, purpose, and calling convention (arguments and return value).

## Operating System Support
1. Linux

## Features


## Roadmap

* Create versions for each programming language that supports Neo, i.e.:
  - Python
  - C#
  - golang

* Needs error handling and feedback
* Implement full modularity

## Setup

`npm install`


## Current Calling convention

```
cd src/nodejs/neoscan

// Get balance for an address on MainNet
node get_balance -n MainNet -a youraddress

// Get current block height on TestNet
node get_height

// List all nodes on Main Net
node get_all_nodes -n MainNet
```




## Planned Future Calling Convention

```
neotools <registered api or implementation name>> <relevant function> <function arguments>
```

Example:

```
neotools neonjs getScriptHashFromAddress AddZkjqPoPyhDhWoA8f9CXQeHQRDr8HbPo




```
