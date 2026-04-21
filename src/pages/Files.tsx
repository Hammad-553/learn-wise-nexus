import { useState, useRef } from "react";
import { Upload, FileText, Trash2, Download, Lock, Send, FolderOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: string;
  dataUrl: string;
  visibility: "private" | "submission";
  course?: string;
  assignment?: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const Files = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Notes");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [course, setCourse] = useState("");
  const [assignment, setAssignment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const submitInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    visibility: "private" | "submission",
  ) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    const added: StoredFile[] = [];
    for (const f of Array.from(list)) {
      if (f.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${f.name} exceeds 10MB`, variant: "destructive" });
        continue;
      }
      const dataUrl = await readFile(f);
      added.push({
        id: `${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        category: visibility === "submission" ? "Submission" : category,
        uploadedAt: new Date().toISOString(),
        dataUrl,
        visibility,
        course: visibility === "submission" ? course : undefined,
        assignment: visibility === "submission" ? assignment : undefined,
      });
    }
    setFiles((prev) => [...added, ...prev]);
    toast({ title: "Uploaded", description: `${added.length} file(s) added.` });
    if (visibility === "submission") {
      setSubmitOpen(false);
      setCourse("");
      setAssignment("");
    }
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    toast({ title: "Deleted", description: "File removed." });
  };

  const downloadFile = (f: StoredFile) => {
    const a = document.createElement("a");
    a.href = f.dataUrl;
    a.download = f.name;
    a.click();
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const privateFiles = filtered.filter((f) => f.visibility === "private");
  const submissions = filtered.filter((f) => f.visibility === "submission");

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const FileCard = ({ f }: { f: StoredFile }) => (
    <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-primary font-medium">
          {f.category}
        </span>
      </div>
      <h4 className="font-semibold text-sm truncate" title={f.name}>{f.name}</h4>
      <p className="text-xs text-muted-foreground mt-1">{formatSize(f.size)}</p>
      {f.course && (
        <p className="text-xs text-muted-foreground mt-1">
          {f.course} {f.assignment && `· ${f.assignment}`}
        </p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground">
          {new Date(f.uploadedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => downloadFile(f)}>
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeFile(f.id)}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Files</h1>
          <p className="text-muted-foreground mt-1">
            Private cloud storage for study materials & assignment submissions.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e, "private")}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Notes">Notes</SelectItem>
              <SelectItem value="Lecture">Lecture</SelectItem>
              <SelectItem value="Reading">Reading</SelectItem>
              <SelectItem value="Reference">Reference</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => inputRef.current?.click()} className="gradient-accent text-secondary">
            <Upload className="w-4 h-4 mr-1" /> Upload
          </Button>
          <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-1" /> Submit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Assignment Submission</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <Input placeholder="Course (e.g. CS301)" value={course} onChange={(e) => setCourse(e.target.value)} />
                <Input placeholder="Assignment title" value={assignment} onChange={(e) => setAssignment(e.target.value)} />
                <input
                  ref={submitInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e, "submission")}
                />
                <Button
                  onClick={() => {
                    if (!course.trim() || !assignment.trim()) {
                      toast({ title: "Missing info", description: "Course & assignment required", variant: "destructive" });
                      return;
                    }
                    submitInputRef.current?.click();
                  }}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  <Upload className="w-4 h-4 mr-1" /> Choose & Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <FolderOpen className="w-3.5 h-3.5" /> Total Files
          </div>
          <div className="text-2xl font-bold">{files.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Lock className="w-3.5 h-3.5" /> Private
          </div>
          <div className="text-2xl font-bold">{privateFiles.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Send className="w-3.5 h-3.5" /> Submissions
          </div>
          <div className="text-2xl font-bold">{submissions.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Upload className="w-3.5 h-3.5" /> Used
          </div>
          <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="private">
        <TabsList>
          <TabsTrigger value="private">
            <Lock className="w-3.5 h-3.5 mr-1.5" /> Private ({privateFiles.length})
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <Send className="w-3.5 h-3.5 mr-1.5" /> Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="private" className="mt-4">
          {privateFiles.length === 0 ? (
            <EmptyState message="No private files yet. Upload notes, PDFs or readings." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {privateFiles.map((f) => <FileCard key={f.id} f={f} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          {submissions.length === 0 ? (
            <EmptyState message="No submissions yet. Use the Submit button to upload assignment files." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {submissions.map((f) => <FileCard key={f.id} f={f} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState message="No files yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((f) => <FileCard key={f.id} f={f} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center pt-4">
        ⓘ Files are stored in your browser only. Enable Lovable Cloud later for persistent, secure storage.
      </p>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="glass-card rounded-xl p-12 text-center">
    <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default Files;
