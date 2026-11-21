import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CitationGenerator from "@/pages/CitationGenerator";
import Glossary from "@/pages/Glossary";
import AddGlossaryTerm from "@/pages/AddGlossaryTerm";
import AdminGlossary from "@/pages/AdminGlossary";
import FAQPage from "@/pages/FAQ";
import AdminFAQ from "@/pages/AdminFAQ";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Resources from "@/pages/Resources";
import FileUpload from "@/pages/FileUpload";
import AdminBlogPosts from "@/pages/AdminBlogPosts";
import AdminDashboard from "@/pages/AdminDashboard";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/citation-generator" component={CitationGenerator} />
        <Route path="/generate" component={CitationGenerator} />
        <Route path="/chat" component={Chat} />
        <Route path="/glossary" component={Glossary} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/resources" component={Resources} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/upload" component={FileUpload} />
        <Route path="/admin/upload" component={FileUpload} />
        <Route path="/admin/blog" component={AdminBlogPosts} />
        <Route path="/admin/glossary" component={AdminGlossary} />
        <Route path="/admin/glossary/add" component={AddGlossaryTerm} />
        <Route path="/admin/faq" component={AdminFAQ} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
