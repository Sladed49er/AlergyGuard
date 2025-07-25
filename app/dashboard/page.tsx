import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get user's profiles
  const profiles = await prisma.profile.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      allergies: true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user.name || session.user.email}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your family's allergy profiles
              </p>
            </div>
            <button
              onClick={async () => {
                'use server'
                const { signOut } = await import('next-auth/react')
                await signOut()
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Profiles Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Family Profiles</h2>
            <Link
              href="/dashboard/profiles/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Profile
            </Link>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No profiles yet. Add your first family member to get started.
              </p>
              <Link
                href="/dashboard/profiles/new"
                className="text-blue-600 hover:text-blue-700"
              >
                Create your first profile →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/dashboard/profiles/${profile.id}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg">{profile.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {profile.relationship}
                  </p>
                  <div className="mt-2">
                    {profile.allergies.length > 0 ? (
                      <p className="text-sm">
                        {profile.allergies.length} allergie(s)
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">No allergies listed</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <Link
            href="/dashboard/meal-planner"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Meal Planner</h3>
            <p className="text-gray-600 text-sm">
              AI-powered meal suggestions based on your allergies
            </p>
          </Link>

          <Link
            href="/dashboard/emergency"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Emergency Info</h3>
            <p className="text-gray-600 text-sm">
              Quick access to emergency contacts and allergy details
            </p>
          </Link>

          <Link
            href="/dashboard/restaurants"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Restaurant Finder</h3>
            <p className="text-gray-600 text-sm">
              Find allergy-friendly restaurants near you
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}