# TRTL CLI

Command line interface to check TurtleCoin network status and community activity.

![Alt Text](https://media.giphy.com/media/8m7LEArtWVfHkuWpPV/giphy.gif)

### Version
1.0.49

## Usage

### Installation

Clone this repository

```sh
$ git clone https://github.com/mrrovot/trtl-cli.git
```

Install the dependencies

```sh
$ npm install
```

### Create Symlink

```sh
$ npm link
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

Displays ascii text from a file in the ascii folder. If nothing is specified, a random ASCII will be picked.
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

### Contribute

Please do a pull request with any data about TurtleCoin that can be useful.

### Contributors

@zack796 @brandonlehmann
