import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { signInWithGoogle, auth } from "./Login";
import { useAuthState } from "react-firebase-hooks/auth";

const drawerWidth = 240;

export default function Navbar(props) {
 const [user] = useAuthState(auth);
 const { window } = props;
 const [mobileOpen, setMobileOpen] = useState(false);

 const handleDrawerToggle = () => {
   setMobileOpen(!mobileOpen);
 };

 const drawer = (
   <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
     <Typography variant="h6" sx={{ my: 2 }}>
       LessonArchitect
     </Typography>
     <Divider />
     <List>
       <ListItem disablePadding>
         <Link href="/user-lessons">
           <ListItemButton variant="text" sx={{ textAlign: "center" }}>
             <ListItemText primary={"Lessons"} />
           </ListItemButton>
         </Link>
       </ListItem>
       <ListItem disablePadding>
         <Link href="/">
           <ListItemButton variant="text" sx={{ textAlign: "center" }}>
             <ListItemText primary={"Create"} />
           </ListItemButton>
         </Link>
       </ListItem>
       <ListItem disablePadding>
         <Link href="/all-lessons">
           <ListItemButton variant="text" sx={{ textAlign: "center" }}>
             <ListItemText primary={"Explore"} />
           </ListItemButton>
         </Link>
       </ListItem>
       <ListItem disablePadding>
         <Link href="/reports">
           <ListItemButton variant="text" sx={{ textAlign: "center" }}>
             <ListItemText primary={"Reports"} />
           </ListItemButton>
         </Link>
       </ListItem>
       <ListItem disablePadding>
         <Link href="/about">
           <ListItemButton variant="text" sx={{ textAlign: "center" }}>
             <ListItemText primary={"About"} />
           </ListItemButton>
         </Link>
       </ListItem>
     </List>
   </Box>
 );

 const container =
   window !== undefined ? () => window().document.body : undefined;

 return (
   <Box sx={{ display: "flex" }}>
     <AppBar component="nav">
       <Toolbar>
         <IconButton
           color="inherit"
           aria-label="open drawer"
           edge="start"
           onClick={handleDrawerToggle}
           sx={{ mr: 2, display: { sm: "none" } }}
         >
           <MenuIcon />
         </IconButton>
         <Image
           alt="Lesson ArArchitect Logo"
           width={40}
           height={40}
           src={"/icon.svg"}
         ></Image>
         <Typography
           variant="h5"
           component="div"
           sx={{ marginLeft: 1, flexGrow: 1, display: { sm: "block" } }}
         >
           LessonArchitect
         </Typography>
         <Box
           sx={{
             display: { xs: "none", sm: "block" },
             flexGrow: 1,
           }}
         >
           <Link href="/user-lessons">
             <Button sx={{ color: "#fff" }} variant="text">
               Lessons
             </Button>
           </Link>
           <Link href="/all-lessons">
             <Button sx={{ color: "#fff" }} variant="text">
               Explore
             </Button>
           </Link>
           <Link href="/">
             <Button sx={{ color: "#fff" }} variant="text">
               Create
             </Button>
           </Link>
           <Link href="/reports">
             <Button sx={{ color: "#fff" }} variant="text">
               Reports
             </Button>
           </Link>
           <Link href="/about">
             <Button sx={{ color: "#fff" }} variant="text">
               About
             </Button>
           </Link>
         </Box>
         <Box
           sx={{
             padding: 2.5,
             paddingRight: { xs: "none" },
           }}
         >
           {user ? (
             <Button sx={{ color: "#fff" }} onClick={() => auth.signOut()}>
               Sign out
             </Button>
           ) : (
             <Button sx={{ color: "#fff" }} onClick={signInWithGoogle}>
               Sign in
             </Button>
           )}
         </Box>
         <Avatar src={user ? user.photoURL : null}></Avatar>
       </Toolbar>
     </AppBar>
     <Box component="nav">
       <Drawer
         container={container}
         variant="temporary"
         open={mobileOpen}
         onClose={handleDrawerToggle}
         ModalProps={{
           keepMounted: true, // Better open performance on mobile.
         }}
         sx={{
           display: { xs: "block", sm: "none" },
           "& .MuiDrawer-paper": {
             boxSizing: "border-box",
             width: drawerWidth,
           },
         }}
       >
         {drawer}
       </Drawer>
     </Box>
   </Box>
 );
}