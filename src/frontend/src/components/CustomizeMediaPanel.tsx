import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, RotateCcw, Music, Image as ImageIcon, Info, Heart } from 'lucide-react';
import { useCustomMedia } from '@/context/CustomMediaContext';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CustomizeMediaPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomizeMediaPanel({ open, onOpenChange }: CustomizeMediaPanelProps) {
  const { photoUrls, audioUrl, feelingsText, setPreviewPhotos, setPreviewAudio, setPreviewFeelings, applyCustomMedia, resetToDefaults } = useCustomMedia();
  const [localPhotoPreviews, setLocalPhotoPreviews] = useState<(string | null)[]>([null, null, null]);
  const [localAudioPreview, setLocalAudioPreview] = useState<string | null>(null);
  const [localFeelingsText, setLocalFeelingsText] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Initialize local feelings text when dialog opens
  useEffect(() => {
    if (open) {
      setLocalFeelingsText(feelingsText);
    }
  }, [open, feelingsText]);

  const handlePhotoChange = (index: number, file: File | null) => {
    if (file) {
      // Revoke old preview URL
      if (localPhotoPreviews[index]) {
        URL.revokeObjectURL(localPhotoPreviews[index]!);
      }
      
      const newPreviews = [...localPhotoPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setLocalPhotoPreviews(newPreviews);

      const newFiles = Array(3).fill(null);
      newFiles[index] = file;
      setPreviewPhotos(newFiles);
    }
  };

  const handleAudioChange = (file: File | null) => {
    if (file) {
      // Revoke old preview URL
      if (localAudioPreview) {
        URL.revokeObjectURL(localAudioPreview);
      }
      
      setLocalAudioPreview(URL.createObjectURL(file));
      setPreviewAudio(file);
    }
  };

  const handleFeelingsChange = (text: string) => {
    setLocalFeelingsText(text);
    setPreviewFeelings(text);
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await applyCustomMedia();
      // Clear local previews
      localPhotoPreviews.forEach(url => url && URL.revokeObjectURL(url));
      setLocalPhotoPreviews([null, null, null]);
      if (localAudioPreview) {
        URL.revokeObjectURL(localAudioPreview);
        setLocalAudioPreview(null);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to apply media:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults();
      // Clear local previews
      localPhotoPreviews.forEach(url => url && URL.revokeObjectURL(url));
      setLocalPhotoPreviews([null, null, null]);
      if (localAudioPreview) {
        URL.revokeObjectURL(localAudioPreview);
        setLocalAudioPreview(null);
      }
      setLocalFeelingsText('');
    } catch (error) {
      console.error('Failed to reset:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const clearPhotoPreview = (index: number) => {
    if (localPhotoPreviews[index]) {
      URL.revokeObjectURL(localPhotoPreviews[index]!);
    }
    const newPreviews = [...localPhotoPreviews];
    newPreviews[index] = null;
    setLocalPhotoPreviews(newPreviews);
  };

  const clearAudioPreview = () => {
    if (localAudioPreview) {
      URL.revokeObjectURL(localAudioPreview);
    }
    setLocalAudioPreview(null);
  };

  const hasChanges = localPhotoPreviews.some(p => p !== null) || localAudioPreview !== null || (localFeelingsText.trim() && localFeelingsText !== feelingsText);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-rose-600">Customize Your Valentine 💕</DialogTitle>
          <DialogDescription>
            Upload your own photos and music, and write your heartfelt message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photos Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-rose-600">Photos</h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div key={index}>
                  <Label htmlFor={`photo-${index}`} className="text-sm text-rose-500">
                    Photo {index + 1}
                  </Label>
                  <Card className="mt-2 overflow-hidden border-2 border-rose-200">
                    <CardContent className="p-2">
                      <div className="relative aspect-[3/4] overflow-hidden rounded bg-rose-50">
                        <img
                          src={localPhotoPreviews[index] || photoUrls[index]}
                          alt={`Photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {localPhotoPreviews[index] && (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute right-1 top-1 h-6 w-6"
                            onClick={() => clearPhotoPreview(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Label
                        htmlFor={`photo-${index}`}
                        className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded border-2 border-dashed border-rose-300 bg-rose-50 p-2 text-xs text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        <Upload className="h-3 w-3" />
                        Upload
                      </Label>
                      <input
                        id={`photo-${index}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoChange(index, file);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-rose-200" />

          {/* Audio Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Music className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-semibold text-rose-600">Music</h3>
            </div>

            <Card className="border-2 border-rose-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="audio" className="text-sm text-rose-500">
                      Background Song
                    </Label>
                    <p className="mt-1 text-xs text-rose-400">
                      {localAudioPreview ? 'New song selected' : 'Using current song'}
                    </p>
                  </div>
                  {localAudioPreview && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={clearAudioPreview}
                      className="text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Label
                    htmlFor="audio"
                    className="flex cursor-pointer items-center gap-2 rounded border-2 border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    <Upload className="h-4 w-4" />
                    Upload MP3
                  </Label>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/mpeg,audio/mp3"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAudioChange(file);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-rose-200" />

          {/* Feelings Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              <h3 className="text-lg font-semibold text-rose-600">Your Feelings</h3>
            </div>

            <Card className="border-2 border-rose-200">
              <CardContent className="p-4">
                <Label htmlFor="feelings" className="text-sm text-rose-500">
                  Express your love in words
                </Label>
                <Textarea
                  id="feelings"
                  placeholder="Write your heartfelt message here..."
                  value={localFeelingsText}
                  onChange={(e) => handleFeelingsChange(e.target.value)}
                  className="mt-2 min-h-[150px] resize-y border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
                <p className="mt-2 text-xs text-rose-400">
                  This message will appear on the celebration screen after "Yes" is clicked
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-rose-200" />

          {/* Help Section */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="mb-2 text-rose-600 hover:text-rose-700"
            >
              <Info className="mr-2 h-4 w-4" />
              {showHelp ? 'Hide' : 'Show'} permanent replacement instructions
            </Button>

            {showHelp && (
              <Alert className="border-rose-200 bg-rose-50">
                <AlertDescription className="text-sm text-rose-700">
                  <p className="mb-2 font-semibold">To permanently replace the default assets:</p>
                  <ol className="ml-4 list-decimal space-y-1">
                    <li>
                      Replace the files in <code className="rounded bg-rose-100 px-1 py-0.5">frontend/public/assets/generated/</code>
                    </li>
                    <li>Keep these exact filenames:
                      <ul className="ml-4 mt-1 list-disc">
                        <li><code className="rounded bg-rose-100 px-1 py-0.5">couple-photo-1.dim_1200x1600.png</code></li>
                        <li><code className="rounded bg-rose-100 px-1 py-0.5">couple-photo-2.dim_1200x1600.png</code></li>
                        <li><code className="rounded bg-rose-100 px-1 py-0.5">couple-photo-3.dim_1200x1600.png</code></li>
                        <li><code className="rounded bg-rose-100 px-1 py-0.5">valentine-song.mp3</code></li>
                      </ul>
                    </li>
                    <li>Rebuild and redeploy your app</li>
                  </ol>
                  <p className="mt-2">
                    <strong>Note:</strong> The customizations you make here are stored locally in your browser and will persist across page refreshes.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isResetting || isApplying}
              className="border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {isResetting ? 'Resetting...' : 'Reset to Defaults'}
            </Button>
            <Button
              onClick={handleApply}
              disabled={!hasChanges || isApplying || isResetting}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {isApplying ? 'Applying...' : 'Apply Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
