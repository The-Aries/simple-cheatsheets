(function () {
  var cheatsheet = window.CHEATSHEET = window.CHEATSHEET || {};
  var common = cheatsheet.common || {};
  if (!common.footer) {
    cheatsheet.pageLoadError = "CHEATSHEET.common.footer is unavailable";
    window.CHEATSHEET_PAGE_LOAD_ERROR = "CHEATSHEET.common.footer is unavailable";
    return;
  }

  var dockerPlaceholders = [
    { key: "imageRef", label: "Image Reference", defaultValue: "nginx:1.27", help: "The full image reference used in pull, run, and inspect examples." },
    { key: "imageName", label: "Image Name", defaultValue: "my-app", help: "A short local image name used when you tag or build an image." },
    { key: "imageTag", label: "Image Tag", defaultValue: "latest", help: "The tag portion used with image names and publish targets." },
    { key: "imageId", label: "Image ID", defaultValue: "sha256:0123456789abcdef", help: "An image ID copied from `docker images` output." },
    { key: "containerName", label: "Container Name", defaultValue: "my-app", help: "A stable container name used for run, logs, exec, and rm commands." },
    { key: "containerId", label: "Container ID", defaultValue: "c1a2b3d4e5f6", help: "A container ID copied from `docker ps` output." },
    { key: "hostPort", label: "Host Port", defaultValue: "8080", help: "The local port you want to expose on your machine." },
    { key: "containerPort", label: "Container Port", defaultValue: "80", help: "The port the service listens on inside the container." },
    { key: "hostPath", label: "Host Path", defaultValue: "./data", help: "A local path or file to mount into a container." },
    { key: "containerPath", label: "Container Path", defaultValue: "/data", help: "The path inside the container that receives the mount." },
    { key: "volumeName", label: "Volume Name", defaultValue: "myapp-data", help: "A named volume used to keep container data after removal." },
    { key: "networkName", label: "Network Name", defaultValue: "myapp-net", help: "A Docker network name used to connect related containers." },
    { key: "envName", label: "Environment Name", defaultValue: "APP_ENV", help: "A common environment variable name passed to the container." },
    { key: "envValue", label: "Environment Value", defaultValue: "development", help: "The value for the environment variable passed to the container." },
    { key: "sourceImageRef", label: "Source Image Reference", defaultValue: "my-app:latest", help: "The source image reference used when creating a new tag." },
    { key: "targetImageRef", label: "Target Image Reference", defaultValue: "registry.example.com/team/my-app:1.0.0", help: "The publish-ready image reference used for tagging and pushing." }
  ];

  function makeGroup(number, key, title, intro, rows, text, officialUrl) {
    return {
      number: String(number),
      key: key,
      title: title,
      intro: intro,
      rows: rows,
      description: {
        text: text,
        officialUrl: officialUrl
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
    makeSection("1", "Image Access And Preparation", [
      makeGroup(
        1,
        "login",
        "docker login",
        "Authenticate to a registry before pulling private images or publishing new ones.",
        [
          { template: "docker login", purpose: "Sign in to the default registry with your local Docker credentials." },
          { template: "docker login registry.example.com", purpose: "Sign in to a private registry host before pull or push." }
        ],
        "Authenticate against the registry before you pull or push private images. Use it once per registry so the CLI can reuse saved credentials.",
        "https://docs.docker.com/reference/cli/docker/login/"
      ),
      makeGroup(
        2,
        "pull",
        "docker pull",
        "Download an image into the local cache for later runs or inspection.",
        [
          { template: "docker pull imageRef", purpose: "Pull the image you want to run or inspect later." },
          { template: "docker pull imageRef@sha256:0123456789abcdef", purpose: "Pull a specific digest when you need an exact immutable image." }
        ],
        "Download a known registry version so it is ready for local runs and inspection. Use it when you need the exact image content on disk.",
        "https://docs.docker.com/reference/cli/docker/image/pull/"
      ),
      makeGroup(
        3,
        "images",
        "docker images",
        "List local images and inspect tags, IDs, and sizes.",
        [
          { template: "docker images", purpose: "Show the local image list with repositories, tags, IDs, and sizes." },
          { template: "docker images imageName", purpose: "Filter the local list to one repository name." },
          { template: "docker images -a", purpose: "Show all images, including intermediate and dangling ones." }
        ],
        "Check what is already available before you pull or build. Use it when you need a quick inventory of local image state.",
        "https://docs.docker.com/reference/cli/docker/image/"
      )
    ]),
    makeSection("2", "Container Run And Basic Management", [
      makeGroup(
        1,
        "run",
        "docker run",
        "Start a container from an image with ports, mounts, and environment variables.",
        [
          { template: "docker run --name containerName -p hostPort:containerPort -d imageRef", purpose: "Run a detached service and publish one port to the host." },
          { template: "docker run --name containerName -p hostPort:containerPort -it imageRef", purpose: "Run interactively when you want to watch output in the terminal." },
          { template: "docker run --name containerName -e envName=envValue imageRef", purpose: "Pass one environment variable into the container." },
          { template: "docker run --name containerName -v hostPath:containerPath imageRef", purpose: "Mount a local path into the container for source files or data." },
          { template: "docker run --rm -it imageRef sh", purpose: "Run a short-lived container and remove it after exit." }
        ],
        "Use this when you want a containerized service or a one-off shell without building extra orchestration around it. It is the main entry point for local development and quick service checks.",
        "https://docs.docker.com/reference/cli/docker/container/run/"
      ),
      makeGroup(
        2,
        "ps",
        "docker ps",
        "List running or stopped containers with names and IDs.",
        [
          { template: "docker ps", purpose: "Show only running containers." },
          { template: "docker ps -a", purpose: "Show running and stopped containers." },
          { template: "docker ps --filter name=containerName", purpose: "Narrow the list to a specific container name." }
        ],
        "Use this when you need a container handle for logs, exec, start, or remove. It is the quickest way to find the container you want to manage next.",
        "https://docs.docker.com/reference/cli/docker/container/ls/"
      ),
      makeGroup(
        3,
        "stop",
        "docker stop",
        "Stop a running container cleanly before maintenance or cleanup.",
        [
          { template: "docker stop containerName", purpose: "Stop a container by name." },
          { template: "docker stop containerId", purpose: "Stop a container by ID when the name is not handy." }
        ],
        "Use this when you want the process to exit without forcing removal. It is the safe first step before inspecting or deleting a container.",
        "https://docs.docker.com/reference/cli/docker/container/stop/"
      ),
      makeGroup(
        4,
        "start",
        "docker start",
        "Restart a previously stopped container without rebuilding it.",
        [
          { template: "docker start containerName", purpose: "Start a stopped container by name." },
          { template: "docker start containerId", purpose: "Start a stopped container by ID." }
        ],
        "Use this when the existing container state is still valid and you do not want a fresh rebuild. It brings an already configured container back online.",
        "https://docs.docker.com/reference/cli/docker/container/start/"
      ),
      makeGroup(
        5,
        "restart",
        "docker restart",
        "Stop and start a container in one step.",
        [
          { template: "docker restart containerName", purpose: "Stop and start a container in one step." },
          { template: "docker restart containerId", purpose: "Restart a container by ID." }
        ],
        "Use this for a quick service refresh when a full rebuild is unnecessary. It is the shortest path from a stale runtime to a fresh one.",
        "https://docs.docker.com/reference/cli/docker/container/restart/"
      ),
      makeGroup(
        6,
        "rm",
        "docker rm",
        "Remove a stopped container from the local machine.",
        [
          { template: "docker rm containerName", purpose: "Remove a stopped container by name." },
          { template: "docker rm -f containerName", purpose: "Force remove a running container when you are sure it should go away." }
        ],
        "Use this after stop when you are done with a container and want the local list clean again. Reach for -f only when you intentionally need to force removal.",
        "https://docs.docker.com/reference/cli/docker/container/rm/"
      )
    ]),
    makeSection("3", "Cleanup And Reclaim", [
      makeGroup(
        1,
        "image-rm",
        "docker image rm",
        "Delete a local image reference when you no longer need it.",
        [
          { template: "docker image rm imageRef", purpose: "Remove a tagged image reference from the local machine." },
          { template: "docker image rm imageId", purpose: "Remove an image by ID when you copied it from `docker images`." }
        ],
        "Use this after tagging or rebuilding so stale images do not accumulate. It removes the local reference, not the remote registry copy.",
        "https://docs.docker.com/reference/cli/docker/image/rm/"
      ),
      makeGroup(
        2,
        "container-prune",
        "docker container prune",
        "Remove all stopped containers in one cleanup pass.",
        [
          { template: "docker container prune", purpose: "Delete every stopped container after a confirmation prompt." }
        ],
        "Use this only when you are ready to discard every stopped container. It is the broad cleanup step for reducing local clutter.",
        "https://docs.docker.com/reference/cli/docker/container/prune/"
      ),
      makeGroup(
        3,
        "system-prune",
        "docker system prune",
        "Remove unused Docker objects in a broad cleanup sweep.",
        [
          { template: "docker system prune", purpose: "Remove unused Docker objects after a confirmation prompt." }
        ],
        "Use this when you are intentionally reclaiming disk space and understand the impact. It can remove more than stopped containers, so treat it as the broad cleanup path.",
        "https://docs.docker.com/engine/manage-resources/pruning/"
      )
    ]),
    makeSection("4", "Debugging And Interaction", [
      makeGroup(
        1,
        "logs",
        "docker logs",
        "Read container output for startup failures or runtime errors.",
        [
          { template: "docker logs containerName", purpose: "Print the current log output for a container." },
          { template: "docker logs -f --tail 100 containerName", purpose: "Watch new log lines while starting from the most recent output." }
        ],
        "Use this before opening a shell when the problem may already be visible in the log stream. It is the quickest way to see what the container has been saying.",
        "https://docs.docker.com/reference/cli/docker/container/logs/"
      ),
      makeGroup(
        2,
        "exec",
        "docker exec",
        "Run a command inside a running container without rebuilding it.",
        [
          { template: "docker exec -it containerName sh", purpose: "Open an interactive shell inside the running container." },
          { template: "docker exec -it containerName env", purpose: "Inspect environment variables or run another simple command in the container." }
        ],
        "Use this when you need a shell or a quick diagnostic command inside the live container. It is the standard way to inspect runtime state in place.",
        "https://docs.docker.com/reference/cli/docker/container/exec/"
      ),
      makeGroup(
        3,
        "inspect",
        "docker inspect",
        "Inspect low-level container or image metadata in JSON form.",
        [
          { template: "docker inspect containerId", purpose: "Print detailed JSON for a container." },
          { template: "docker inspect imageRef", purpose: "Print detailed JSON for an image." }
        ],
        "Use this when high-level commands do not expose the field you need. It gives you the structured metadata behind the container or image.",
        "https://docs.docker.com/reference/cli/docker/container/inspect/"
      )
    ]),
    makeSection("5", "Build Local Images", [
      makeGroup(
        1,
        "build",
        "docker build",
        "Build a local image from a Dockerfile and build context.",
        [
          { template: "docker build -t imageName:imageTag .", purpose: "Build the current directory into a tagged local image." },
          { template: "docker build -f Dockerfile -t imageName:imageTag .", purpose: "Build from an explicit Dockerfile path." }
        ],
        "Use this for development images or repeatable README examples. It turns your Dockerfile and context into a local image ready for run or tag.",
        "https://docs.docker.com/reference/cli/docker/build-legacy/"
      )
    ]),
    makeSection("6", "Name And Publish Images", [
      makeGroup(
        1,
        "tag",
        "docker tag",
        "Assign a new name or registry path to an existing image.",
        [
          { template: "docker tag sourceImageRef targetImageRef", purpose: "Give an existing image a new registry-ready name." },
          { template: "docker tag imageId targetImageRef", purpose: "Tag an image by ID when you copied it from `docker images`." }
        ],
        "Use this when the image is ready to publish but does not yet have the right tag. It creates the registry-facing name without rebuilding the image.",
        "https://docs.docker.com/reference/cli/docker/image/tag/"
      ),
      makeGroup(
        2,
        "push",
        "docker push",
        "Upload a tagged image to a registry after authentication.",
        [
          { template: "docker push targetImageRef", purpose: "Push the tagged image to the registry." },
          { template: "docker push imageRef", purpose: "Push a single-tag image directly when the name is already registry-ready." }
        ],
        "Use this after the image name and repository path are ready. It publishes the tagged image to the registry you logged into earlier.",
        "https://docs.docker.com/reference/cli/docker/image/push/"
      )
    ])
  ];

  var dockerWorkflowCards = [
    { title: "Get An Image", text: "Log in when needed, then pull a ready-made image or verify what is already local." },
    { title: "Run A Container", text: "Use `docker run` with a name, ports, mounts, and environment variables." },
    { title: "Inspect And Debug", text: "Check `docker ps`, read `docker logs`, open `docker exec`, and inspect details." },
    { title: "Clean Up", text: "Stop and remove containers first, then prune only when you are ready to reclaim space." },
    { title: "Publish", text: "Tag the image for the registry, then push it after you are signed in." }
  ];

  var dockerPage = {
    slug: "docker",
    meta: {
      title: "Docker Cheatsheet - Simple Cheatsheets",
      lang: "zh-CN"
    },
    layout: {
      hasSidebar: true
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
        type: "note",
        id: "official-references",
        title: "Official References",
        text: "Use the Docker CLI and engine docs as the entry point. Each command section below links to the exact CLI reference.",
        links: [
          { label: "Docker CLI reference", href: "https://docs.docker.com/reference/cli/docker/" },
          { label: "Docker Engine docs", href: "https://docs.docker.com/engine/" }
        ]
      },
      {
        type: "placeholderForm",
        id: "placeholders",
        headingId: "values-title",
        title: "Placeholders",
        intro: "Set the sample values once, then apply them to commands and copy the results straight into your terminal."
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
    footer: common.footer
  };

  cheatsheet.pageData = dockerPage;
  cheatsheet.page = dockerPage;
  window.CHEATSHEET_PAGE_DATA = dockerPage;
  window.CHEATSHEET_PAGE = dockerPage;
})();
