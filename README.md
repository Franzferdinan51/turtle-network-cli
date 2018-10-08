# TRTL CLI

Command line interface to check TurtleCoin network status and community activity.

![Alt Text](https://media.giphy.com/media/8m7LEArtWVfHkuWpPV/giphy.gif)

### Version
1.0.57

## Usage

### Installation

Clone this repository

```sh
$ git clone https://github.com/turtlecoin/turtle-network-cli.git
```

### Execute run script

```sh
$ npm run trtl
```

### Commands (work in progress)

Check list of all commands (--help or --h)
```sh
$ trtl --help
```

Shows network data (network or 'ne')
```sh
$ trtl network
```

Get usd worth of any TRTL amount (price <quantity> or 'p' <quantity>)
```sh
$ trtl price 100
```

List market data (market or 'm')
```sh
$ trtl market
```

List circulating supply (supply or 's')
```sh
$ trtl supply
```

Displays ascii text from a file in the ascii folder. If nothing is specified, a random ASCII will be picked (ascii or a)
```sh
$ trtl ascii <file>
```

Check how long ago the checkpoints were updated (checkpoints or 'c')
```sh
$ trtl checkpoints
```

Display every public node on the [turtlecoin-nodes-json](https://github.com/turtlecoin/turtlecoin-nodes-json) list (nodes or 'no')
```sh
$ trtl nodes
```

Default command displays transaction pool. Adding a transaction hash will provide information about the transaction and if it is confirmed (tx or t)
```sh
$ trtl tx <transaction>
```

### Contribute

Please do a pull request with any data about TurtleCoin that can be useful.

### Contributors

@zack796 @brandonlehmann
