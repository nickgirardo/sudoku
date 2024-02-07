{
  description = "Sudoku";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-23.11";
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, gitignore }:
    let
      allSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs allSystems (system: f {
        inherit system;
        pkgs = import nixpkgs { inherit system; };
      });
    in {
      packages = forAllSystems ({ pkgs, ... }: rec {
        default = sudoku;
        sudoku = pkgs.buildNpmPackage {
          name = "sudoku";
          src = gitignore.lib.gitignoreSource ./.;
          npmDepsHash = "sha256-IOQ2rz/XYwXlN9E8zhUb7lTcGKRGisZch+5IHjCHc0Y=";
          installPhase = ''
            mkdir -p $out/dist
            cp -r dist/ $out/
          '';
        };
      });
    };
}
