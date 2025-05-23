// // FallbackCreator.jsx
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export default function FallbackCreator() {
//   return (
//     <div className='flex flex-col h-full bg-gradient-to-br from-background to-muted'>
//       <Card className='m-8 max-w-md mx-auto'>
//         <CardHeader className='text-center'>
//           <div className='text-6xl mb-4'>⚠️</div>
//           <CardTitle className='text-2xl text-destructive'>
//             Missing Dependencies
//           </CardTitle>
//           <CardDescription>
//             This component requires React Three Fiber and related packages to
//             work properly.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className='space-y-4'>
//           <div className='bg-muted p-4 rounded-lg'>
//             <p className='text-sm text-muted-foreground mb-2 font-medium'>
//               Install the required packages:
//             </p>
//             <code className='text-primary text-sm font-mono'>
//               npm install @react-three/fiber @react-three/drei three
//             </code>
//           </div>
//           <p className='text-xs text-muted-foreground text-center'>
//             After installing, restart your development server.
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// FallbackCreator.jsx
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
    <div className='flex flex-col h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4'>
      <Card className='w-full max-w-lg bg-card shadow-2xl'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-4xl'>
            ⚠️
          </div>
          <CardTitle className='text-3xl font-bold text-destructive'>
            Missing Dependencies
          </CardTitle>
          <CardDescription className='mt-2 text-lg text-muted-foreground'>
            This 3D Model Creator requires React Three Fiber and related
            packages to function.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='bg-muted/50 p-4 rounded-lg border border-border'>
            <p className='text-sm text-foreground mb-2 font-medium'>
              Please install the required packages using npm or yarn:
            </p>
            <code className='block whitespace-pre-wrap rounded bg-slate-700 p-3 font-mono text-sm text-primary-foreground shadow-inner'>
              npm install @react-three/fiber @react-three/drei three
              three-stdlib
            </code>
            <p className='text-xs text-muted-foreground mt-2'>
              (three-stdlib is recommended for up-to-date loaders like
              RGBELoader)
            </p>
          </div>
          <p className='text-sm text-muted-foreground text-center'>
            After installation, please restart your development server.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => window.location.reload()}
            className='w-full'
            variant='secondary'
          >
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
