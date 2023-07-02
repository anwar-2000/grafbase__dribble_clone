import { redirect } from "next/navigation";

import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { fetchProjectDetails } from "@/lib/actions";
import { ProjectInterface } from "@/common.types";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();

  if (!session?.user) redirect("/")

  const result = await fetchProjectDetails(id) as { projects?: ProjectInterface };
  
  if (!result?.projects) return (
    <p className="no-result-text">Failed to fetch project info</p>
  )

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>

      <ProjectForm type="edit" session={session} project={result?.projects} />
    </Modal>
  );
};

export default EditProject;
