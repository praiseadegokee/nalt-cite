import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CitationGenerator from "@/pages/CitationGenerator";
import Glossary from "@/pages/Glossary";
import FAQ from "@/pages/FAQ";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Resources from "@/pages/Resources";
import FileUpload from "@/pages/FileUpload";
import AdminBlogPosts from "@/pages/AdminBlogPosts";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/citation-generator" component={CitationGenerator} />
        <Route path="/glossary" component={Glossary} />
        <Route path="/faq" component={FAQ} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/resources" component={Resources} />
        <Route path="/admin/upload" component={FileUpload} />
        <Route path="/admin/blog" component={AdminBlogPosts} />
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
