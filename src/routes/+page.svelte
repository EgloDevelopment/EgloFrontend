<script>
  import Navbar from "../components/navbar.svelte";
  import Drawer from "../components/drawer.svelte";

  let data1 = {
    friends: [
      {
        name: "test",
        id: "test",
      },
      {
        name: "test",
        id: "test",
      },
      {
        name: "test",
        id: "test",
      },
      {
        name: "test",
        id: "test",
      },
    ],

    groups: [
      {
        name: "gtoupd",
        id: "2493874",
      },
      {
        name: "gtoupd",
        id: "2493874",
      },
    ],

    servers: [
      {
        name: "usygf",
        id: "2493874",
      },
      {
        name: "server",
        id: "2493874",
      },
    ],
  };

  let data2 = {
    friends: [
      {
        name: "test",
        id: "test",
      },
      {
        name: "test",
        id: "test",
      },
      {
        name: "test",
        id: "test",
      },
      {
        name: "test",
        id: "test",
      },
    ],

    groups: [
      {
        name: "gtoupd",
        id: "2493874",
      },
      {
        name: "gtoupd",
        id: "2493874",
      },
    ],

    servers: [
      {
        name: "usygf",
        id: "2493874",
      },
      {
        name: "server",
        id: "2493874",
      },
    ],
  };

  let relationships = data1
  let notifications = data2
</script>

<Navbar />
<Drawer {relationships} />
