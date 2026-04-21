(function () {
  var common = window.CHEATSHEET_COMMON || {};
  if (!common.sharedFooter) {
    window.CHEATSHEET_PAGE_LOAD_ERROR = "CHEATSHEET_COMMON.sharedFooter is unavailable";
    return;
  }

  var dockerPlaceholders = [
    { key: "imageRef", label: "imageRef", defaultValue: "nginx:1.27", help: "A complete image reference used in pull, run, and inspect examples." },
    { key: "imageName", label: "imageName", defaultValue: "my-app", help: "A short local image name used when you tag or build an image." },
    { key: "imageTag", label: "imageTag", defaultValue: "latest", help: "A common version tag used with image names." },
    { key: "imageId", label: "imageId", defaultValue: "sha256:0123456789abcdef", help: "An image ID copied from `docker images` output." },
    { key: "containerName", label: "containerName", defaultValue: "my-app", help: "A stable container name used for run, logs, exec, and rm commands." },
    { key: "containerId", label: "containerId", defaultValue: "c1a2b3d4e5f6", help: "A container ID copied from `docker ps` output." },
    { key: "hostPort", label: "hostPort", defaultValue: "8080", help: "A port on your local machine that you want to expose." },
    { key: "containerPort", label: "containerPort", defaultValue: "80", help: "The port the service listens on inside the container." },
    { key: "hostPath", label: "hostPath", defaultValue: "./data", help: "A local path or file to mount into a container." },
    { key: "containerPath", label: "containerPath", defaultValue: "/data", help: "The path inside the container that receives the mount." },
    { key: "volumeName", label: "volumeName", defaultValue: "myapp-data", help: "A named volume used to keep container data after removal." },
    { key: "networkName", label: "networkName", defaultValue: "myapp-net", help: "A Docker network name used to connect related containers." },
    { key: "envName", label: "envName", defaultValue: "APP_ENV", help: "A common environment variable name passed to the container." },
    { key: "envValue", label: "envValue", defaultValue: "development", help: "The value for the environment variable passed to the container." },
    { key: "sourceImageRef", label: "sourceImageRef", defaultValue: "my-app:latest", help: "The source image reference used when creating a new tag." },
    { key: "targetImageRef", label: "targetImageRef", defaultValue: "registry.example.com/team/my-app:1.0.0", help: "The publish-ready image reference used for tagging and pushing." }
  ];

  function makeGroup(number, key, title, intro, rows, text, officialUrl, officialLabel) {
    return {
      number: String(number),
      key: key,
      title: title,
      intro: intro,
      rows: rows,
      description: {
        text: text,
        officialUrl: officialUrl,
        officialLabel: officialLabel
      }
    };
  }

  function makeSection(number, title, groups) {
    return {
      number: String(number),
      title: title,
      groups: groups
    };
  }

  var dockerSections = [
    makeSection("1", "Image access and preparation", [
      makeGroup(
        1,
        "login",
        "login",
        "Authenticate to a registry before pulling private images or publishing new ones.",
        [
          { template: "docker login", purpose: "Sign in to the default registry with your local Docker credentials." },
          { template: "docker login registry.example.com", purpose: "Sign in to a private registry host before pull or push." }
        ],
        "Use this first when a registry needs authentication. For less common registry flags and credential behavior, check the official docs.",
        "https://docs.docker.com/reference/cli/docker/login/",
        "docker login documentation"
      ),
      makeGroup(
        2,
        "pull",
        "pull",
        "Download an image so it is available locally for run or inspect workflows.",
        [
          { template: "docker pull imageRef", purpose: "Pull the image you want to run or inspect later." },
          { template: "docker pull imageRef@sha256:0123456789abcdef", purpose: "Pull a specific digest when you need an exact immutable image." }
        ],
        "Use an exact reference when you want repeatable local runs. For registry options, pull policies, and edge cases, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/image/pull/",
        "docker pull documentation"
      ),
      makeGroup(
        3,
        "images",
        "images",
        "List local images so you can verify what is already downloaded or built.",
        [
          { template: "docker images", purpose: "Show the local image list with repositories, tags, IDs, and sizes." },
          { template: "docker images imageName", purpose: "Filter the local list to one repository name." },
          { template: "docker images -a", purpose: "Show all images, including intermediate and dangling ones." }
        ],
        "Use the repository filter for quick lookup, and use `-a` when you need the full local image set. For formatting and filtering details, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/image/",
        "docker image documentation"
      )
    ]),
    makeSection("2", "Container run and basic management", [
      makeGroup(
        1,
        "run",
        "run",
        "Start a new container from an image and keep the command simple enough for local development.",
        [
          { template: "docker run --name containerName -p hostPort:containerPort -d imageRef", purpose: "Run a detached service and publish one port to the host." },
          { template: "docker run --name containerName -p hostPort:containerPort -it imageRef", purpose: "Run interactively when you want to watch output in the terminal." },
          { template: "docker run --name containerName -e envName=envValue imageRef", purpose: "Pass one environment variable into the container." },
          { template: "docker run --name containerName -v hostPath:containerPath imageRef", purpose: "Mount a local path into the container for source files or data." },
          { template: "docker run --rm -it imageRef sh", purpose: "Run a short-lived container and remove it after exit." }
        ],
        "Use `-d` for services, `-p` for port mapping, `-e` for environment variables, and `-v` for local data or source mounts. For restart policy, pull policy, resource limits, and other advanced flags, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/run/",
        "docker run documentation"
      ),
      makeGroup(
        2,
        "ps",
        "ps",
        "Check which containers are running and get the container name or ID you need for other commands.",
        [
          { template: "docker ps", purpose: "Show only running containers." },
          { template: "docker ps -a", purpose: "Show running and stopped containers." },
          { template: "docker ps --filter name=containerName", purpose: "Narrow the list to a specific container name." }
        ],
        "Use `-a` when you need stopped containers too, and use filters when you are looking for one exact container. For output formatting and more filter options, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/ls/",
        "docker ps documentation"
      ),
      makeGroup(
        3,
        "stop",
        "stop",
        "Stop a running container cleanly so you can inspect or remove it afterward.",
        [
          { template: "docker stop containerName", purpose: "Stop a container by name." },
          { template: "docker stop containerId", purpose: "Stop a container by ID when the name is not handy." }
        ],
        "Use names for readability and IDs when you copied the value from `docker ps`. For signal and timeout options, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/stop/",
        "docker stop documentation"
      ),
      makeGroup(
        4,
        "start",
        "start",
        "Start a previously stopped container again without rebuilding it.",
        [
          { template: "docker start containerName", purpose: "Start a stopped container by name." },
          { template: "docker start containerId", purpose: "Start a stopped container by ID." }
        ],
        "Use this when you want the same container state and configuration back. For attach options and less common flags, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/start/",
        "docker start documentation"
      ),
      makeGroup(
        5,
        "restart",
        "restart",
        "Bounce a container when you need a quick service refresh.",
        [
          { template: "docker restart containerName", purpose: "Stop and start a container in one step." },
          { template: "docker restart containerId", purpose: "Restart a container by ID." }
        ],
        "Use restart for a quick refresh after changing a local dependency or environment. For timeout and signal behavior, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/restart/",
        "docker restart documentation"
      ),
      makeGroup(
        6,
        "rm",
        "rm",
        "Remove a container after you are done with it, especially after test or debug runs.",
        [
          { template: "docker rm containerName", purpose: "Remove a stopped container by name." },
          { template: "docker rm -f containerName", purpose: "Force remove a running container when you are sure it should go away." }
        ],
        "Remove stopped containers regularly so your local list stays readable. Use `-f` only when you understand that it stops and removes the container together. For more options, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/rm/",
        "docker rm documentation"
      )
    ]),
    makeSection("3", "Cleanup and reclaim", [
      makeGroup(
        1,
        "image-rm",
        "image rm",
        "Remove a local image when you no longer need the tag or ID.",
        [
          { template: "docker image rm imageRef", purpose: "Remove a tagged image reference from the local machine." },
          { template: "docker image rm imageId", purpose: "Remove an image by ID when you copied it from `docker images`." }
        ],
        "Warning: removing images can break containers that still depend on them. For more removal flags and platform details, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/image/rm/",
        "docker image rm documentation"
      ),
      makeGroup(
        2,
        "container-prune",
        "container prune",
        "Remove all stopped containers to reclaim space and reduce clutter.",
        [
          { template: "docker container prune", purpose: "Delete every stopped container after a confirmation prompt." }
        ],
        "Warning: this deletes every stopped container, not just the one you are thinking about. Review the prompt carefully, and check the official docs for `--filter` and `-f` behavior.",
        "https://docs.docker.com/reference/cli/docker/container/prune/",
        "docker container prune documentation"
      ),
      makeGroup(
        3,
        "system-prune",
        "system prune",
        "Remove unused containers, networks, images, and build cache in one cleanup pass.",
        [
          { template: "docker system prune", purpose: "Remove unused Docker objects after a confirmation prompt." }
        ],
        "Warning: this is the broad cleanup command and can remove more than you expect. For the `-a` option and the exact prune scope, see the official docs.",
        "https://docs.docker.com/engine/manage-resources/pruning/",
        "Docker pruning documentation"
      )
    ]),
    makeSection("4", "Debugging and interaction", [
      makeGroup(
        1,
        "logs",
        "logs",
        "Read container output to troubleshoot startup failures or runtime errors.",
        [
          { template: "docker logs containerName", purpose: "Print the current log output for a container." },
          { template: "docker logs -f --tail 100 containerName", purpose: "Watch new log lines while starting from the most recent output." }
        ],
        "Use `-f` when you want live log follow and `--tail` when you only need the recent part of a long log. For timestamps, since/until filters, and formatting, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/logs/",
        "docker logs documentation"
      ),
      makeGroup(
        2,
        "exec",
        "exec",
        "Open a shell or run a command inside a running container.",
        [
          { template: "docker exec -it containerName sh", purpose: "Open an interactive shell inside the running container." },
          { template: "docker exec -it containerName env", purpose: "Inspect environment variables or run another simple command in the container." }
        ],
        "Use `-it` for interactive debugging and choose the shell that exists in the image, usually `sh` for minimal images. For detach keys and other options, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/exec/",
        "docker exec documentation"
      ),
      makeGroup(
        3,
        "inspect",
        "inspect",
        "Inspect low-level container or image details when logs and ps are not enough.",
        [
          { template: "docker inspect containerId", purpose: "Print detailed JSON for a container." },
          { template: "docker inspect imageRef", purpose: "Print detailed JSON for an image." }
        ],
        "Use inspect when you need ports, mounts, labels, network data, or exact IDs. For formatting and platform options, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/container/inspect/",
        "docker inspect documentation"
      )
    ]),
    makeSection("5", "Build local images", [
      makeGroup(
        1,
        "build",
        "build",
        "Create a local image from a Dockerfile for development or README examples.",
        [
          { template: "docker build -t imageName:imageTag .", purpose: "Build the current directory into a tagged local image." },
          { template: "docker build -f Dockerfile -t imageName:imageTag .", purpose: "Build from an explicit Dockerfile path." }
        ],
        "Use `-t` for a friendly local name and `-f` when the Dockerfile is not in the default location. For build context, cache, secrets, and other advanced flags, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/build-legacy/",
        "docker build documentation"
      )
    ]),
    makeSection("6", "Name and publish images", [
      makeGroup(
        1,
        "tag",
        "tag",
        "Create a publish-ready image name without rebuilding the image.",
        [
          { template: "docker tag sourceImageRef targetImageRef", purpose: "Give an existing image a new registry-ready name." },
          { template: "docker tag imageId targetImageRef", purpose: "Tag an image by ID when you copied it from `docker images`." }
        ],
        "Use tag when you want one local build to carry multiple names or registry targets. For naming rules and advanced tag behavior, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/image/tag/",
        "docker tag documentation"
      ),
      makeGroup(
        2,
        "push",
        "push",
        "Upload a tagged image to a registry after you have logged in.",
        [
          { template: "docker push targetImageRef", purpose: "Push the tagged image to the registry." },
          { template: "docker push imageRef", purpose: "Push a single-tag image directly when the name is already registry-ready." }
        ],
        "Use push after tag so the registry sees the exact name you want users to pull later. For multi-tag pushes and registry options, see the official docs.",
        "https://docs.docker.com/reference/cli/docker/image/push/",
        "docker push documentation"
      )
    ])
  ];

  var dockerWorkflowCards = [
    { title: "Get an image", text: "Log in when needed, then pull a ready-made image or verify what is already local." },
    { title: "Run a container", text: "Use `docker run` with a name, ports, mounts, and environment variables." },
    { title: "Inspect and debug", text: "Check `docker ps`, read `docker logs`, open `docker exec`, and inspect details." },
    { title: "Clean up", text: "Stop and remove containers first, then prune only when you are ready to reclaim space." },
    { title: "Publish", text: "Tag the image for the registry, then push it after you are signed in." }
  ];

  window.CHEATSHEET_PAGE_DATA = {
    slug: "docker",
    meta: {
      title: "Docker Cheatsheet - Simple Cheatsheets",
      lang: "zh-CN"
    },
    layout: {
      hasSidebar: true
    },
    extensions: {
      styles: ["data/pages/docker/styles.css"]
    },
    placeholders: {
      fields: dockerPlaceholders
    },
    blocks: [
      {
        type: "pageHeader",
        id: "page-header",
        title: "Docker Cheatsheet",
        descriptionTitle: "Description",
        lead: "This page is a practical cheatsheet for the most common Docker commands. It focuses on local development, debugging, running services, and README examples. It uses Docker Engine and the docker CLI as the baseline. For uncommon flags and advanced behavior, see the official Docker docs linked in each section."
      },
      {
        type: "placeholderForm",
        id: "placeholders",
        headingId: "values-title",
        title: "Placeholders",
        intro: "Set the sample values once, then apply them to commands and copy the results straight into your terminal.",
        fields: dockerPlaceholders
      },
      {
        type: "concepts",
        id: "key-concepts",
        title: "Key Concepts",
        items: [
          "An image is the reusable template; a container is the running instance created from that template.",
          "Names are easier to scan, while IDs are exact references you can copy from `docker images` or `docker ps`.",
          "Port mapping connects a host port to a container port so you can reach the service from your machine.",
          "Bind mounts and named volumes help you keep data outside the container lifecycle.",
          "Use `docker login` before private registries so pull and push can reuse saved credentials."
        ]
      },
      {
        type: "workflow",
        id: "workflow-overview",
        title: "Workflow Overview",
        description: "A practical Docker flow usually goes from image access to container run, then inspection and cleanup, and finally tag and publish if you want to share the image.",
        cards: dockerWorkflowCards
      },
      {
        type: "sectionGroups",
        sections: dockerSections
      }
    ],
    footer: common.sharedFooter
  };
})();
