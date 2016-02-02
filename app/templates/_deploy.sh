PARSED_OPTIONS=$(getopt -o hni:f:t: --long "help,name,id:,from:,to:" -- "$@")
if [ $? -ne 0 ];
then
  exit 1
fi
eval set -- "$PARSED_OPTIONS"
while true;
do
  case "$1" in

    -h|--help)
      echo "usage -n -i -f -t OR --name --id --from --to"
      shift;;

    -n|--name)
      if [ -n "$2" ];
      then
        JOB_NAME=$2
      fi
      shift 2;;

    -i|--id)
      if [ -n "$2" ];
      then
        BUILD_ID=$2
      fi
      shift 2;;

    -f|--from)
      if [ -n "$2" ];
      then
        FROM=$2
      fi
      shift 2;;

    -t|--to)
      if [ -n "$2" ];
      then
        WORKDIR=$2
      fi
      shift 2;;

    --)
      shift
      break;;
  esac
done

cd $WORKDIR

# Preparing new folder.
rm -rf docroot_new
rm -rf docroot_old
mkdir docroot_new

# Coping files.
cp -fr $FROM/artifacts/docroot/* docroot_new
mv $WORKDIR/docroot $WORKDIR/docroot_old
mv $WORKDIR/docroot_new $WORKDIR/docroot

ln -s $WORKDIR/settings.local.php $WORKDIR/docroot/sites/default/settings.local.php
ln -s $WORKDIR/shared_files $WORKDIR/docroot/sites/default/files
