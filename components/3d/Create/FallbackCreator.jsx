
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FallbackCreator() {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-4 text-slate-100'>
      <Card className='w-full max-w-lg bg-slate-800/80 border border-slate-700 shadow-2xl backdrop-blur-sm'>
        <CardHeader className='text-center p-6'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-4xl ring-2 ring-red-500/30'>
            ⚠️
          </div>
          <CardTitle className='text-2xl font-bold text-red-400'>
            Required 3D Libraries Missing
          </CardTitle>
          <CardDescription className='mt-2 text-base text-slate-400'>
            The 3D Model Creator needs specific packages like @react-three/fiber
            to work.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 px-6 pb-6'>
          <div className='bg-slate-900/60 p-4 rounded-md border border-slate-700'>
            <p className='text-sm text-slate-200 mb-2 font-medium'>
              Please install the necessary packages:
            </p>
            <code className='block whitespace-pre-wrap rounded bg-slate-800/80 p-3 font-mono text-sm text-purple-300 shadow-inner border border-slate-700 select-all'>
              npm install @react-three/fiber @react-three/drei three
              three-stdlib
            </code>
            <p className='text-xs text-slate-500 mt-2'>
              Or using yarn:{" "}
              <code className='text-purple-400/80'>
                yarn add @react-three/fiber @react-three/drei three three-stdlib
              </code>
            </p>
          </div>
          <p className='text-sm text-slate-400 text-center'>
            After installation, please restart your development server and
            refresh this page.
          </p>
        </CardContent>
        <CardFooter className='p-6 pt-0'>
          <Button
            onClick={() => window.location.reload()}
            className='w-full bg-purple-600 hover:bg-purple-700 text-white'
            variant='default' // Explicitly default, or remove variant for default Shadcn styling
          >
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
