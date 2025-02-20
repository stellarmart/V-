---
name: Develop in a Nomad Docker Container
description: Get started with Nomad Workspaces.
tags: [cloud, nomad]
icon: /icon/nomad.svg
---

# Develop in a Nomad Docker Container

This example shows how to use Nomad service tasks to be used as a development environment using docker and host csi volumes.

## Prerequisites

- [Nomad](https://www.nomadproject.io/downloads)
- [Docker](https://docs.docker.com/get-docker/)

## Setup

### 1. Start the CSI Host Volume Plugin

The CSI Host Volume plugin is used to mount host volumes into Nomad tasks. This is useful for development environments where you want to mount persistent volumes into your container workspace.

1. Login to the Nomad server using SSH.

2. Append the following stanza to your Nomad server configuration file and restart the nomad service.

   ```hcl
   plugin "docker" {
     config {
       allow_privileged = true
     }
   }
   ```

   ```shell
   sudo systemctl restart nomad
   ```

3. Create a file `hostpath.nomad` with following content:

   ```hcl
   job "hostpath-csi-plugin" {
     datacenters = ["dc1"]
     type = "system"

     group "csi" {
       task "plugin" {
         driver = "docker"

         config {
           image = "registry.k8s.io/sig-storage/hostpathplugin:v1.10.0"

           args = [
             "--drivername=csi-hostpath",
             "--v=5",
             "--endpoint=${CSI_ENDPOINT}",
             "--nodeid=node-${NOMAD_ALLOC_INDEX}",
           ]

           privileged = true
         }

         csi_plugin {
           id   = "hostpath"
           type = "monolith"
           mount_dir = "/csi"
         }

         resources {
           cpu    = 256
           memory = 128
         }
       }
     }
   }
   ```

4. Run the job:

   ```shell
   nomad job run hostpath.nomad
   ```

### 2. Setup the Nomad Template

1. Create the template by running the following command:

   ```shell
   coder template init nomad-docker
   cd nomad-docker
   coder template create
   ```

2. Set up Nomad server address and optional authentication:

3. Create a new workspace and start developing.
