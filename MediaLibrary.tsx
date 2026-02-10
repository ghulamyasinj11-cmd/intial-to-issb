import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Search,
  Grid,
  List,
  Image,
  FileText,
  Video,
  Music,
  MoreVertical,
  Trash2,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getMediaFiles, getMediaFolders, uploadMedia, deleteMedia } from '@/lib/cmsStore';
import { toast } from 'sonner';
import type { MediaFile, MediaFolder } from '@/types/cms';

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, [currentFolder]);

  const loadMedia = () => {
    setFiles(getMediaFiles().filter((f) => f.folder === currentFolder));
    setFolders(getMediaFolders());
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    const uploadPromises = Array.from(uploadedFiles).map((file) =>
      uploadMedia(file, currentFolder)
    );

    try {
      await Promise.all(uploadPromises);
      loadMedia();
      toast.success('Files uploaded successfully');
    } catch {
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (file: MediaFile) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      deleteMedia(file.id);
      loadMedia();
      toast.success('File deleted');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string, filename?: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'document':
        return filename?.endsWith('.pdf') ? FileText : Music;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220]">Media Library</h1>
          <p className="text-[#5A6578] mt-1">Manage your images, videos, and documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-primary rounded-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-[#1D4ED8] text-white' : 'bg-white text-[#5A6578]'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-[#1D4ED8] text-white' : 'bg-white text-[#5A6578]'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <button
          onClick={() => setCurrentFolder('root')}
          className="text-[#5A6578] hover:text-[#1D4ED8] transition-colors"
        >
          Media
        </button>
        {currentFolder !== 'root' && (
          <>
            <ChevronRight className="w-4 h-4 text-[#5A6578]" />
            <span className="text-[#0B1220]">
              {folders.find((f) => f.id === currentFolder)?.name}
            </span>
          </>
        )}
      </div>

      {/* Files Display */}
      {filteredFiles.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group bg-white rounded-xl border border-[rgba(11,18,32,0.08)] overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-[#F6F7F9] flex items-center justify-center relative">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      {(() => {
                        const Icon = getFileIcon(file.type, file.filename);
                        return <Icon className="w-12 h-12 text-[#5A6578] mx-auto" />;
                      })()}
                      <p className="text-xs text-[#5A6578] mt-2 uppercase">{file.mimeType.split('/')[1]}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(file); }} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-[#0B1220] truncate">{file.name}</p>
                  <p className="text-xs text-[#5A6578]">{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[rgba(11,18,32,0.08)] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F6F7F9]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5A6578]">File</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5A6578]">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5A6578]">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#5A6578]">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-[#5A6578]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(11,18,32,0.08)]">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-[#F6F7F9] cursor-pointer"
                    onClick={() => setSelectedFile(file)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F6F7F9] rounded-lg flex items-center justify-center">
                          {file.type === 'image' ? (
                            <img src={file.url} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            (() => {
                              const Icon = getFileIcon(file.type, file.filename);
                              return <Icon className="w-5 h-5 text-[#5A6578]" />;
                            })()
                          )}
                        </div>
                        <span className="font-medium text-[#0B1220]">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6578] capitalize">{file.type}</td>
                    <td className="px-4 py-3 text-sm text-[#5A6578]">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-[#5A6578]">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(file); }} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[rgba(11,18,32,0.14)]">
          <Image className="w-16 h-16 text-[#5A6578]/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0B1220] mb-2">No files found</h3>
          <p className="text-[#5A6578] mb-4">Upload your first file to get started.</p>
          <Button onClick={() => fileInputRef.current?.click()} className="btn-primary">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      )}

      {/* File Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="mt-4">
              {selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-full max-h-[400px] object-contain rounded-xl"
                />
              ) : selectedFile.type === 'video' ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="w-full max-h-[400px] rounded-xl"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-[#F6F7F9] rounded-xl">
                  <div className="text-center">
                    {(() => {
                      const Icon = getFileIcon(selectedFile.type, selectedFile.filename);
                      return <Icon className="w-16 h-16 text-[#5A6578] mx-auto mb-4" />;
                    })()}
                    <p className="text-[#5A6578]">Preview not available</p>
                  </div>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#5A6578]">Filename:</span>
                  <p className="font-medium">{selectedFile.filename}</p>
                </div>
                <div>
                  <span className="text-[#5A6578]">Type:</span>
                  <p className="font-medium capitalize">{selectedFile.type}</p>
                </div>
                <div>
                  <span className="text-[#5A6578]">Size:</span>
                  <p className="font-medium">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <span className="text-[#5A6578]">Uploaded:</span>
                  <p className="font-medium">{new Date(selectedFile.uploadedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={() => copyUrl(selectedFile.url)} className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedFile);
                    setSelectedFile(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
